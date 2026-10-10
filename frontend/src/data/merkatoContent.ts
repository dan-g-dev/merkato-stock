import { PricingPlan, Testimonial } from "../types";

export const FEATURES_MEGA_MENU = {
  columns: [
    {
      heading: "Purchasing",
      items: [
        { title: "Purchase orders", description: "Create and track vendor purchases" },
        { title: "Purchase receives", description: "Record incoming stock shipments" },
        { title: "Vendor payments", description: "Manage bills and supplier dues" },
      ],
    },
    {
      heading: "Warehousing",
      items: [
        { title: "Multi-warehouse management", description: "Control inventory across multiple locations" },
        { title: "Transfer orders", description: "Move stock smoothly between depots" },
        { title: "Picklists", description: "Optimize item retrieval for packaging" },
        { title: "Bin locations", description: "Categorize shelf and rack placement" },
      ],
    },
    {
      heading: "Order fulfillment",
      items: [
        { title: "Backorders and dropshipping", description: "Never lose orders during supply gaps" },
        { title: "Packaging and shipping", description: "Generate labels and assign box geometry" },
        { title: "Post-shipment tracking", description: "Real-time dispatch and transit alerts" },
        { title: "Package geometry", description: "Calculate optimal dimensional fit" },
      ],
    },
    {
      heading: "Inventory",
      items: [
        { title: "Item Groups & Composite Items", description: "Assemble bundled kits with bill of materials" },
        { title: "Serial and batch tracking", description: "Trace expiry dates and individual assets" },
        { title: "Price Lists", description: "Set customer-tier and volume discounts" },
        { title: "Inventory Adjustments", description: "Reconcile shrinkage and physical counts" },
        { title: "Barcode generation and scanning", description: "Speed up dispatch with 1D/2D barcodes" },
      ],
    },
    {
      heading: "Order management",
      items: [
        { title: "Sales order management", description: "Handle multi-channel sales from one console" },
        { title: "Multichannel selling", description: "Sync Amazon, Shopify, Etsy, and eBay" },
        { title: "Invoicing", description: "Convert sales orders to instant invoices" },
        { title: "Sales returns", description: "Handle reverse logistics and restocks" },
      ],
    },
    {
      heading: "Automation and analytics",
      items: [
        { title: "Email and field update", description: "Trigger automatic status alerts" },
        { title: "Webhooks and custom functions", description: "Integrate REST endpoints and Deluge" },
        { title: "Reporting", description: "Instant inventory turnover & margin analytics" },
        { title: "Merkato Analytics", description: "Deep business intelligence and forecasting" },
      ],
    },
  ],
  sidebar: {
    title: "Complete Feature List",
    description: "Get the comprehensive PDF brochure with all technical capabilities.",
    actionText: "Download now >",
  },
};

export const SOLUTIONS_MEGA_MENU = {
  industries: [
    { title: "Retail", subtitle: "Boost retail sales, reduce costs" },
    { title: "Ecommerce", subtitle: "Sell across channels, sell smart" },
    { title: "Dropshipping", subtitle: "Multiple stages, made easy" },
    { title: "Manufacturing", subtitle: "Bill of materials & component tracking" },
  ],
  useCases: [
    { title: "Inventory control", subtitle: "Manage and track items, end-to-end" },
    { title: "Warehouse management", subtitle: "Control stock across locations" },
    { title: "Multi-channel selling", subtitle: "Sync stock and streamline sales" },
    { title: "Order management", subtitle: "Manage sales and fulfill orders" },
    { title: "Order fulfillment", subtitle: "Pick, pack, and ship centrally" },
  ],
};

export const INTEGRATIONS_MEGA_MENU = {
  categories: [
    "Shopping Cart",
    "Accounting",
    "Shipping",
    "Sales & Marketing",
    "Payment Services",
    "Analytics",
    "EDI",
    "Merkato Apps",
    "Other Apps",
  ],
  spotlight: {
    name: "Etsy",
    description: "Streamline inventory levels and sync orders automatically.",
  },
};

export const RESOURCES_MEGA_MENU = {
  connect: [
    { title: "Forums", desc: "Ask questions and get answers" },
    { title: "Webinars", desc: "Stay updated on best practices" },
    { title: "Partners", desc: "Find expert partners or become one" },
    { title: "Developers", desc: "Build apps with easy-to-use APIs" },
    { title: "Support", desc: "Contact our product experts 24x5" },
  ],
  learn: [
    { title: "Academy", desc: "Get the latest information on inventory" },
    { title: "Help documentation", desc: "Tips and tricks on using MERKATO STOCK" },
    { title: "FAQs", desc: "Answers to most asked questions" },
    { title: "Blog", desc: "Latest news, updates, and insights" },
    { title: "Free tools", desc: "Unlock growth for your business" },
  ],
  featuredGuide: {
    title: "Efficient warehouse labeling: Practical guide",
    action: "Read now >",
  },
};

export const CLIENT_LOGOS = [
  { name: "Element.", tag: "SKATEBOARDS & APPAREL" },
  { name: "snakebyte", tag: "GAMING GEAR" },
  { name: "rapido", tag: "BIKE TAXI" },
  { name: "ALLOYGATOR", tag: "WHEEL PROTECTION" },
  { name: "MILLER INDUSTRIAL", tag: "MANUFACTURING" },
  { name: "BEAR KNUCKLES", tag: "SAFETY APPAREL" },
  { name: "ÆTHEION", tag: "SKINCARE TECH" },
  { name: "BOHECO", tag: "HEMP SCIENCE" },
  { name: "MAX MARINE", tag: "ELECTRONICS" },
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Ideal for small home businesses starting their inventory journey.",
    monthlyPrice: 0,
    yearlyPrice: 0,
    ordersLimit: "50 Orders / month",
    warehousesLimit: "1 Warehouse",
    usersLimit: "2 Users",
    features: [
      "50 shipping labels / month",
      "1 warehouse location",
      "Manual stock adjustments",
      "Standard email support",
      "Basic invoicing",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    description: "For growing retail and ecommerce stores requiring multi-channel sync.",
    monthlyPrice: 39,
    yearlyPrice: 29,
    ordersLimit: "500 Orders / month",
    warehousesLimit: "2 Warehouses",
    usersLimit: "3 Users",
    isPopular: true,
    features: [
      "500 shipping labels / month",
      "2 warehouse locations",
      "Serial number tracking",
      "E-commerce channels (Shopify, Amazon)",
      "Automated stock sync",
      "Composite item assembly",
      "Customer portal",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    description: "For expanding brands needing advanced batch tracking and barcodes.",
    monthlyPrice: 99,
    yearlyPrice: 79,
    ordersLimit: "3,000 Orders / month",
    warehousesLimit: "5 Warehouses",
    usersLimit: "5 Users",
    features: [
      "3,000 shipping labels / month",
      "5 warehouse locations",
      "Batch & Expiry date tracking",
      "Barcode generation & scanning",
      "Dropshipping & Backordering",
      "Carrier shipping rate automation",
      "Custom fields & user roles",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    description: "Comprehensive control for mid-sized manufacturers & wholesalers.",
    monthlyPrice: 159,
    yearlyPrice: 129,
    ordersLimit: "7,500 Orders / month",
    warehousesLimit: "7 Warehouses",
    usersLimit: "10 Users",
    features: [
      "7,500 shipping labels / month",
      "7 warehouse locations",
      "Multi-currency support",
      "Deluge automation & webhooks",
      "Advanced warehouse bin management",
      "Merkato Analytics deep BI reports",
      "Priority 24/5 support",
    ],
  },
  {
    id: "elite",
    name: "Elite",
    description: "Enterprise scale with dedicated workflows and high volume throughput.",
    monthlyPrice: 299,
    yearlyPrice: 239,
    ordersLimit: "15,000+ Orders / month",
    warehousesLimit: "15 Warehouses",
    usersLimit: "15 Users",
    features: [
      "15,000+ shipping labels / month",
      "15 warehouse locations",
      "Unlimited custom workflows",
      "Dedicated account manager",
      "Custom integrations assistance",
      "Highest API rate limits",
      "SLA guarantee",
    ],
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Patrick Fletch",
    role: "Director of Business Development",
    company: "AlloyGator Limited",
    quote:
      "MERKATO STOCK has been a great addition to managing our fast-growing distribution business. Managing stocks and returns across multiple warehouses has been easier than expected. The support team is extremely responsive and being a business owner that sort of communication is important.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
    logo: "ALLOYGATOR",
  },
  {
    name: "Marcus Vance",
    role: "Head of Global Supply Chain",
    company: "Snakebyte Gaming",
    quote:
      "With multi-channel selling across Amazon, our online store, and retail distributors, keeping inventory synchronised in real time was our biggest headache. MERKATO STOCK solved that in our first week. We cut stockouts by 92%.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
    logo: "SNAKEBYTE",
  },
  {
    name: "Aravind S.",
    role: "Operations Director",
    company: "Rapido Logistics",
    quote:
      "The order packaging geometry and automated shipping label generation saved our warehouse team over 3 hours every single morning. The mobile application gives our floor managers instant stock lookup.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
    logo: "RAPIDO",
  },
];
