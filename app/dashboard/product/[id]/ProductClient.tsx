"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import ColorSelector from "@/app/components/ColorSelector";
import SizeSelector from "@/app/components/SizeSelector";
import { ProductLeft } from "./ProductLeft";
import { ProductRight } from "./ProductRight";

type Variant = {
  id: string;
  size?: string;
  stock?: number;
  price?: number | null;
  sku?: string | null;
  color?: string | null;
  color_hex?: string | null;
  color_visual?: {
    kind?: "solid" | "gradient" | "multicolor" | "unknown";
    cssBackground?: string | null;
    hex?: string | null;
    name?: string | null;
    gelatoColorKey?: string | null;
  } | null;
  product_color_id?: string;
};

type ProductClientProps = {
  product: any;
  images: string[];
  id: string;
};

type InfoItem = [string, string];

const SIZE_ORDER = ["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];

const normalizeSize = (size: unknown) =>
  String(size ?? "").trim().toUpperCase();

const sizeRank = (size: unknown) => {
  const normalized = normalizeSize(size);
  const index = SIZE_ORDER.indexOf(normalized);
  return index === -1 ? 999 : index;
};

export default function ProductClient({
  product,
  images,
  id,
}: ProductClientProps) {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const lastSaveRef = useRef(0);

  const safeImages = useMemo(() => {
    const cleanImages = Array.isArray(images) ? images.filter(Boolean) : [];
    return cleanImages.length > 0 ? cleanImages : ["/placeholder.png"];
  }, [images]);

  useEffect(() => {
    const mapped: Variant[] = Array.isArray(product?.variants)
      ? product.variants.map((variant: Variant) => ({
          ...variant,
          size: normalizeSize(variant.size),
          stock: Number(variant.stock ?? 0),
          price: variant.price != null ? Number(variant.price) : null,
          color: variant.color ?? null,
          color_hex: variant.color_visual?.hex || variant.color_hex || null,
          color_visual: variant.color_visual || null,
        }))
      : [];

    mapped.sort((a, b) => {
      const aIndex = sizeRank(a.size);
      const bIndex = sizeRank(b.size);
      return aIndex - bIndex;
    });

    const initial =
      mapped.find((variant) => (variant.stock ?? 0) > 0) || mapped[0] || null;

    setVariants(mapped);
    setSelectedVariant(initial);
    setSelectedColor(
      initial?.color_visual?.cssBackground ||
        initial?.color_hex ||
        initial?.color ||
        null,
    );
  }, [product]);

  const colors = useMemo(() => {
    const uniqueColors = new Map<
      string,
      {
        name: string | null | undefined;
        hex: string;
        cssBackground?: string | null;
        variant: Variant;
      }
    >();

    for (const variant of variants) {
      if (!variant.color) continue;

      const key = String(variant.color).toLowerCase();

      if (!uniqueColors.has(key)) {
        uniqueColors.set(key, {
          name: variant.color,
          hex: variant.color_visual?.hex || variant.color_hex || "",
          cssBackground: variant.color_visual?.cssBackground || variant.color_visual?.hex || variant.color_hex || null,
          variant,
        });
      }
    }

    return Array.from(uniqueColors.values());
  }, [variants]);

  const availableVariants = useMemo(() => {
    if (!selectedColor) return variants;

    const colorKey = String(selectedColor).toLowerCase();

    return variants.filter(
      (variant) =>
        [
          variant.color,
          variant.color_hex,
          variant.color_visual?.hex,
          variant.color_visual?.cssBackground,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase() === colorKey)
    );
  }, [variants, selectedColor]);

  const sizesText = useMemo(() => {
    const sizes = Array.from(
      new Set(variants.map((variant) => variant.size).filter(Boolean))
    ).sort((a, b) => sizeRank(a) - sizeRank(b));

    return sizes.length ? sizes.join(", ") : "Select size";
  }, [variants]);

  const colorsText = useMemo(() => {
    const names = colors.map((color) => color.name).filter(Boolean);
    return names.length ? names.join(", ") : "Select color";
  }, [colors]);
  const colorNames = useMemo(
    () => colors.map((color) => color.name).filter((name): name is string => Boolean(name)),
    [colors]
  );
  const selectedColorMedia = useMemo(() => {
    const productColors = Array.isArray(product?.colors) ? product.colors : [];
    const selectedColorName = String(selectedVariant?.color || "").toLowerCase();
    const currentColor =
      productColors.find((color: any) => String(color?.color || "").toLowerCase() === selectedColorName) ||
      productColors[0] ||
      null;

    return {
      front: currentColor?.mockup_front || currentColor?.thumbnail || safeImages[0] || null,
      back: currentColor?.mockup_back || safeImages[1] || currentColor?.mockup_front || safeImages[0] || null,
    };
  }, [product?.colors, safeImages, selectedVariant?.color]);
  const sizeNames = useMemo(
    () =>
      Array.from(
        new Set(
          variants
            .map((variant) => variant.size)
            .filter((size): size is string => Boolean(size))
        )
      ).sort(
        (a, b) => sizeRank(a) - sizeRank(b)
      ),
    [variants]
  );

  const totalStock = useMemo(() => {
    return variants.reduce(
      (acc, variant) => acc + Number(variant.stock ?? 0),
      0
    );
  }, [variants]);
  const compactNumber = (value: number) =>
    new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

  const productBullets = useMemo(() => {
    const rawBullets = [
      product?.material,
      product?.fit,
      product?.print_type,
      product?.feature,
      product?.special_feature,
    ]
      .map((value) => String(value ?? "").trim())
      .filter(Boolean);

    if (rawBullets.length) return rawBullets.slice(0, 4);

    const descriptionLines = String(product?.description ?? "")
      .split(/\r?\n|\. /)
      .map((value) => value.replace(/\.$/, "").trim())
      .filter(Boolean);

    if (descriptionLines.length) return descriptionLines.slice(0, 4);

    return [
      product?.title ? `${product.title}` : "Product details available after selection",
      sizesText ? `Available sizes: ${sizesText}` : "",
      colorsText ? `Available colors: ${colorsText}` : "",
      totalStock > 0 ? `${totalStock} items available` : "Availability depends on selected variant",
    ].filter(Boolean);
  }, [colorsText, product, sizesText, totalStock]);

  const productBrand =
    product?.brand ||
    product?.collection ||
    product?.category ||
    product?.title ||
    "Ryfio product";

  const selectedVariantLabel =
    [selectedVariant?.color, selectedVariant?.size].filter(Boolean).join(" / ") ||
    selectedVariant?.sku ||
    "Not selected";

  const priceSummary =
    selectedVariant?.price != null
      ? `${product?.currency || "EUR"} ${selectedVariant.price}`
      : product?.price != null
      ? `${product?.currency || "EUR"} ${product.price}`
      : "Price updates after selecting a variant.";

  const sizeGuideRows = Array.from(
    new Set(variants.map((variant) => normalizeSize(variant.size)).filter(Boolean))
  )
    .sort((a, b) => sizeRank(a) - sizeRank(b))
    .map((size) => {
      const variantsForSize = variants.filter((variant) => normalizeSize(variant.size) === size);
      const stockForSize = variantsForSize.reduce(
        (acc, variant) => acc + Number(variant.stock ?? 0),
        0
      );
      const colorsForSize = new Set(
        variantsForSize.map((variant) => variant.color).filter(Boolean)
      ).size;

      return {
        size,
        colors: colorsForSize,
        stock: stockForSize,
        selected: normalizeSize(selectedVariant?.size) === size,
      };
    });

  const selectedPrice =
    selectedVariant?.price != null
      ? Number(selectedVariant.price)
      : product?.price != null
      ? Number(product.price)
      : null;
  const originalPrice =
    product?.price != null ? Number(product.price) : selectedPrice;
  const currency = product?.currency || "EUR";
  const detailTile = (label: string, value: ReactNode) => (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <div className="mt-2 text-sm font-semibold leading-snug text-white/82 lg:text-base">
        {value}
      </div>
    </div>
  );

  const accordionRows = [
    {
      title: "Regional pricing",
      tone: "from-emerald-400/18 to-cyan-400/10",
      content: (
        <div className="grid gap-4 lg:grid-cols-3">
          {detailTile("Selected price", priceSummary)}
          {detailTile(
            "Base price",
            originalPrice != null ? `${currency} ${originalPrice}` : "Calculated by variant"
          )}
          {detailTile("Checkout costs", "Shipping and taxes calculated at checkout")}
          <p className="lg:col-span-3 text-white/58">
            Price follows the selected color and size. If the customer changes
            variant before checkout, the final product price updates with that
            variant while delivery stays destination-based.
          </p>
        </div>
      ),
    },
    {
      title: "Production",
      tone: "from-orange-400/20 to-amber-300/10",
      content: (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {detailTile("Workflow", product?.production_type || "Prepared after confirmation")}
          {detailTile("Processing", product?.processing_time || "Usually prepared after artwork review")}
          {detailTile("Variant", selectedVariantLabel)}
          {detailTile("Quality check", "Color, size and artwork are reviewed before checkout continues")}
        </div>
      ),
    },
    {
      title: "Stock availability",
      tone: "from-violet-400/20 to-fuchsia-400/10",
      content: (
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <CompactStat
              label="Current selection"
              value={selectedVariantLabel}
              helper={
                selectedVariant?.stock != null
                  ? `${selectedVariant.stock.toLocaleString("en-US")} available`
                  : "Choose a variant"
              }
            />
            <CompactStat
              label="Total stock"
              value={totalStock > 0 ? compactNumber(totalStock) : "Pending"}
              helper={totalStock > 0 ? `${totalStock.toLocaleString("en-US")} units across variants` : "Needs selection"}
            />
            <CompactStat
              label="Status"
              value={totalStock > 0 ? "Available" : "Check"}
              helper={totalStock > 0 ? "Ready variants found" : "Confirm color and size"}
            />
          </div>

          <ChipGroup label="Available colors" items={colorNames} maxVisible={14} />
          <ChipGroup label="Available sizes" items={sizeNames} maxVisible={12} />
        </div>
      ),
    },
    {
      title: "Size guide",
      tone: "from-cyan-400/20 to-blue-400/10",
      content: (
        <div className="space-y-4">
          <SizeGuideTable rows={sizeGuideRows} />
          <p className="text-white/58">
            Selected size: {selectedVariant?.size || "not selected"}.{" "}
            {product?.size_tip ||
              "For a relaxed fit, compare the selected size with a garment the customer already likes."}
          </p>
        </div>
      ),
    },
    {
      title: "File specifications",
      tone: "from-pink-400/20 to-violet-400/10",
      content: (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {detailTile("Artwork", "High-resolution, print-ready file recommended")}
          {detailTile("Print areas", "Front and back supported")}
          {detailTile("Safe zone", "Keep key details inside the visible print area")}
          {detailTile("References", "Internal IDs are hidden from customers")}
        </div>
      ),
    },
    {
      title: "Tips and guides",
      tone: "from-sky-400/20 to-emerald-400/10",
      content: (
        <ol className="grid list-decimal gap-3 pl-5 md:grid-cols-2 xl:grid-cols-4">
          <li>Choose the product color first so the artwork contrast is easy to judge.</li>
          <li>Select the size before checkout to lock the correct variant.</li>
          <li>Review front and back print areas before continuing to the editor.</li>
          <li>Use a clean artwork file with enough resolution for apparel printing.</li>
        </ol>
      ),
    },
    {
      title: "FAQ",
      tone: "from-lime-400/18 to-emerald-400/10",
      content: (
        <div className="grid gap-3 md:grid-cols-2">
          <QuestionTile question="Can this product be customized?" answer="Yes. Choose the variant, then continue to the editor to place artwork." />
          <QuestionTile question="Does price change with variants?" answer="It can. The selected size or color may carry a different product price." />
          <QuestionTile question="When is delivery calculated?" answer="Shipping, taxes and destination costs are calculated during checkout." />
          <QuestionTile question="What should customers check first?" answer="Color, size, stock and print placement before confirming the design." />
        </div>
      ),
    },
  ] satisfies Array<{ title: string; tone: string; content: ReactNode }>;

  const saveSelection = useCallback(
    async (variant: Variant | null, color: string | null) => {
      try {
        const now = Date.now();

        if (now - lastSaveRef.current < 700) return;

        lastSaveRef.current = now;

        await fetch("/api/user-selection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            product_id: id,
            variant_id: variant?.id ?? null,
            size: variant?.size ?? null,
            color,
          }),
        });
      } catch (err) {
        console.error("SAVE SELECTION ERROR:", err);
      }
    },
    [id]
  );

  const handleColorChange = useCallback(
    (color: string, variant?: Variant) => {
      const colorKey = String(color).toLowerCase();
      const currentSize = normalizeSize(selectedVariant?.size);

      const nextVariant =
        variant ||
        variants.find(
          (item) =>
            String(item.color).toLowerCase() === colorKey &&
            normalizeSize(item.size) === currentSize &&
            (item.stock ?? 0) > 0
        ) ||
        variants.find(
          (item) =>
            String(item.color).toLowerCase() === colorKey &&
            normalizeSize(item.size) === currentSize
        ) ||
        variants.find(
          (item) =>
            String(item.color).toLowerCase() === colorKey &&
            (item.stock ?? 0) > 0
        ) ||
        variants.find((item) => String(item.color).toLowerCase() === colorKey) ||
        null;

      setSelectedColor(color);
      setSelectedVariant(nextVariant);
      saveSelection(nextVariant, color);
    },
    [selectedVariant?.size, variants, saveSelection]
  );

  const handleSizeChange = useCallback(
    (variant: Variant) => {
      const nextColor =
        variant?.color_visual?.cssBackground ||
        variant?.color_hex ||
        variant?.color ||
        selectedColor;

      setSelectedVariant(variant);
      setSelectedColor(nextColor);
      saveSelection(variant, nextColor);
    },
    [saveSelection, selectedColor]
  );

  return (
    <div className="w-full min-w-0 space-y-5 bg-transparent lg:space-y-8">
      <div className="grid min-w-0 grid-cols-1 items-start gap-4 lg:grid-cols-2 lg:gap-8 xl:gap-12">
        <div className="min-w-0">
          <ProductLeft
            images={safeImages}
            product={product}
          />
        </div>

        <div className="product-enter-right min-w-0 p-[3px] lg:sticky lg:top-20 lg:p-4 xl:p-8">
          <ProductRight
            product={product}
            selectedVariant={selectedVariant}
            variantControls={
              <div className="product-enter-up order-1 space-y-4 lg:order-none lg:col-span-2">
                <div className="border border-white/[0.07] bg-[linear-gradient(180deg,#241a31_0%,#191322_100%)] px-5 py-3 sm:px-6 lg:px-8 lg:py-4">
                  <SizeSelector
                    variants={availableVariants}
                    selectedVariant={selectedVariant}
                    selectedColor={selectedColor}
                    onChange={handleSizeChange}
                  />
                </div>
                <div className="border border-white/[0.07] bg-[linear-gradient(180deg,#241a31_0%,#191322_100%)] px-5 py-5 sm:px-6 lg:px-8 lg:py-7">
                  <ColorSelector
                    variants={variants}
                    selectedColor={selectedColor}
                    selectedSize={selectedVariant?.size}
                    selectedVariant={selectedVariant}
                    onChange={handleColorChange}
                  />
                </div>
              </div>
            }
          />
        </div>
      </div>

      <section className="bg-[#2a2630] px-[3px] py-4 text-white [content-visibility:auto] [contain-intrinsic-size:900px] sm:px-5 lg:px-8 lg:py-10 xl:px-12">
        <div className="mx-auto max-w-[1680px] space-y-4 lg:space-y-6">
          <div className="rounded-lg border border-white/[0.1] bg-[#17111f] px-5 py-6 shadow-[0_18px_70px_rgba(0,0,0,0.28)] lg:px-14 lg:py-10">
            <div className="max-w-[1180px]">
              <ul className="list-disc space-y-2 pl-5 text-left text-[14px] leading-relaxed text-white/74 lg:text-[18px]">
                {productBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </div>

          <WhitePanel title="Print areas" className="min-h-[174px] lg:min-h-[300px]">
            <div className="flex flex-wrap items-start gap-5 pt-2 lg:gap-8 lg:pt-4">
              <PrintAreaBadge label="Front" image={selectedColorMedia.front} />
              <PrintAreaBadge label="Back" image={selectedColorMedia.back} />
            </div>
          </WhitePanel>

          <div className="grid gap-4 md:grid-cols-2">
            <WhitePanel title="Brands">
              <p className="text-[13px] text-white/64 lg:text-[15px]">
                {productBrand}
              </p>
            </WhitePanel>

            <WhitePanel title="Special Features">
              <p className="max-w-[620px] text-[13px] leading-relaxed text-white/64 lg:text-[15px]">
                {product?.special_feature ||
                  product?.feature ||
                  product?.description ||
                  "Key details are based on the selected product, color and size."}
              </p>
            </WhitePanel>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <WhitePanel title="EU GPSR Compliance Information">
              <ul className="list-disc space-y-1.5 pl-5 text-[13px] leading-relaxed text-white/64 lg:text-[15px]">
                <li>Manufacturer contact information</li>
                <li>Name: {product?.manufacturer_name || productBrand}</li>
                <li>Email address: {product?.manufacturer_email || "Available on request"}</li>
                <li>
                  Postal address:{" "}
                  {product?.manufacturer_address || "Available on request"}
                </li>
                <li>Age guidelines: {product?.age_guidelines || "General use"}</li>
                <li>Warranty: {product?.warranty || "Handled according to the applicable customer policy"}</li>
                <li>Product safety compliance: {product?.safety_compliance || "Reviewed according to the product information available for this item"}</li>
              </ul>
            </WhitePanel>

            <WhitePanel title="Care Instructions">
              <CareLine
                title="General"
                text={product?.care_general || `${product?.title || "This product"} should be handled with care to preserve the print and fabric.`}
              />
              <CareLine
                title="Wash"
                text={product?.care_wash || "Wash gently and avoid harsh detergents to protect the artwork."}
              />
              <CareLine
                title="Dry"
                text={product?.care_dry || "Dry with low heat or air dry when possible to preserve the garment shape."}
              />
              <CareLine
                title="Store"
                text={product?.care_store || product?.care_iron || "Store folded or hanging in a dry place, away from excessive heat."}
              />
            </WhitePanel>
          </div>

          {accordionRows.map((row) => (
            <FaqRow key={row.title} title={row.title} tone={row.tone} content={row.content} />
          ))}
        </div>
      </section>
    </div>
  );
}

function WhitePanel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-white/[0.1] bg-[#17111f] px-5 py-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] lg:px-8 lg:py-7 ${className}`}>
      <h3 className="text-[18px] font-semibold leading-none text-white lg:text-[24px]">
        {title}
      </h3>
      <div className="mt-5 lg:mt-7">{children}</div>
    </div>
  );
}

function PrintAreaBadge({ label, image }: { label: string; image?: string | null }) {
  return (
    <div className="flex w-[132px] flex-col items-start gap-2 lg:w-[180px] lg:gap-3">
      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg border border-white/[0.1] bg-white/[0.04]">
        {image ? (
          <img
            src={image}
            alt={`${label} print area`}
            className="h-full w-full object-contain p-2"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="text-xs font-semibold text-white/40">No image</div>
        )}
      </div>
      <span className="text-[11px] font-semibold text-white/60 lg:text-[13px]">{label}</span>
    </div>
  );
}

function CareLine({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex gap-3 pb-3 last:pb-0 lg:gap-4 lg:pb-4">
      <div className="mt-0.5 h-4 w-4 shrink-0 rounded-sm border border-white/35 bg-white/[0.04]" />
      <div>
        <p className="text-[11px] font-bold text-white lg:text-[12px]">{title}</p>
        <p className="mt-0.5 text-[12px] leading-relaxed text-white/62 lg:text-[14px]">{text}</p>
      </div>
    </div>
  );
}

function CompactStat({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="min-h-[118px] rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <p className="mt-3 text-xl font-black leading-tight text-white lg:text-2xl">
        {value}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-white/52 lg:text-sm">
        {helper}
      </p>
    </div>
  );
}

function ChipGroup({
  label,
  items,
  maxVisible,
}: {
  label: string;
  items: string[];
  maxVisible: number;
}) {
  const visibleItems = items.slice(0, maxVisible);
  const hiddenCount = Math.max(0, items.length - visibleItems.length);

  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {visibleItems.length ? (
          visibleItems.map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/[0.1] bg-white/[0.06] px-3 py-1 text-xs font-semibold text-white/72"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="text-sm text-white/48">Choose a variant to see options.</span>
        )}
        {hiddenCount > 0 ? (
          <span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/[0.08] px-3 py-1 text-xs font-bold text-fuchsia-100">
            +{hiddenCount} more
          </span>
        ) : null}
      </div>
    </div>
  );
}

function SizeGuideTable({
  rows,
}: {
  rows: Array<{ size: string; colors: number; stock: number; selected: boolean }>;
}) {
  if (!rows.length) {
    return (
      <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4 text-white/58">
        Size details will appear after variants are loaded.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-white/[0.08]">
      <div className="grid grid-cols-4 bg-white/[0.06] px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/38">
        <span>Size</span>
        <span>Colors</span>
        <span>Stock</span>
        <span>Status</span>
      </div>
      {rows.map((row) => (
        <div
          key={row.size}
          className={`grid grid-cols-4 border-t border-white/[0.08] px-4 py-3 text-sm ${
            row.selected ? "bg-cyan-400/[0.09] text-cyan-100" : "text-white/68"
          }`}
        >
          <span className="font-bold text-white">{row.size}</span>
          <span>{row.colors || "-"}</span>
          <span>{row.stock}</span>
          <span>{row.selected ? "Selected" : row.stock > 0 ? "Available" : "Check"}</span>
        </div>
      ))}
    </div>
  );
}

function QuestionTile({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-4">
      <p className="text-sm font-black text-white">{question}</p>
      <p className="mt-2 text-sm leading-relaxed text-white/60">{answer}</p>
    </div>
  );
}

function FaqRow({
  title,
  tone,
  content,
}: {
  title: string;
  tone: string;
  content: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-lg border border-white/[0.1] bg-[#17111f] shadow-[0_18px_70px_rgba(0,0,0,0.2)]">
      <summary className="flex cursor-pointer list-none items-center justify-between px-6 py-5 text-[18px] font-semibold text-white [&::-webkit-details-marker]:hidden lg:px-8 lg:py-7 lg:text-[24px]">
        <span className="flex items-center gap-3">
          <span className={`h-3 w-3 rounded-full bg-gradient-to-br ${tone}`} />
          {title}
        </span>
        <ChevronDown
          size={22}
          className="text-white/72 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className={`border-t border-white/[0.08] bg-gradient-to-br ${tone} px-6 pb-5 pt-4 text-[13px] leading-relaxed text-white/70 lg:px-8 lg:pb-7 lg:pt-5 lg:text-[15px]`}>
        <div className="rounded-lg border border-white/[0.08] bg-[#17111f]/80 p-4 lg:p-5">
          {content}
        </div>
      </div>
    </details>
  );
}

function DeliveryPill({
  icon: Icon,
  title,
  value,
  tone,
}: {
  icon: any;
  title: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-[24px] bg-white/[0.03] px-5 py-5 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-fuchsia-400/[0.08]">
          <Icon size={18} className={tone} />
        </div>
        <div>
          <p className="text-[13px] font-bold text-white">{title}</p>
          <p className="mt-1 text-sm text-white/62">{value}</p>
        </div>
      </div>
    </div>
  );
}

function SpecCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: any;
  label: string;
  value: string;
  tone: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.035] p-4 transition-colors hover:border-white/20">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex h-13 w-13 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] p-3">
          <Icon className={tone} size={26} strokeWidth={2.35} aria-hidden />
        </div>
      </div>

      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        {label}
      </p>

      <p className="mt-1 line-clamp-2 text-[15px] font-black leading-snug text-white">
        {value}
      </p>
    </div>
  );
}

function InfoBox({
  icon: Icon,
  title,
  accent,
  items,
}: {
  icon: any;
  title: string;
  accent: string;
  items: InfoItem[];
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.035] transition-colors hover:border-white/20">
      <div className={`pointer-events-none absolute right-0 top-0 h-24 w-24 rounded-bl-full ${accent}`} />

      <div className="relative flex items-center justify-between gap-3 p-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035]">
            <Icon size={25} strokeWidth={2.35} className="text-white" aria-hidden />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-lg font-black tracking-[-0.03em] text-white sm:text-xl">
              {title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-white/35">
              Product information
            </p>
          </div>
        </div>
      </div>

      <div className="relative grid gap-2 border-t border-white/[0.08] p-4 pt-3">
        {items.map(([label, value]) => (
          <div
            key={label}
            className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/30">
              {label}
            </p>

            <p className="mt-1 text-sm font-extrabold leading-snug text-white/78">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
