"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = require("bcryptjs");
const prisma = new client_1.PrismaClient();
async function main() {
    const adminPassword = await (0, bcryptjs_1.hash)('Admin@123', 10);
    const userPassword = await (0, bcryptjs_1.hash)('User@123', 10);
    await prisma.user.createMany({
        data: [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: adminPassword,
                isAdmin: true,
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: userPassword,
            },
        ],
        skipDuplicates: true,
    });
    const brands = await prisma.brand.createMany({
        data: [
            { name: 'Apple', slug: 'apple', description: 'Premium electronics', logo: '/logos/apple.png' },
            { name: 'Samsung', slug: 'samsung', description: 'Innovative tech products', logo: '/logos/samsung.png' },
            { name: 'Nike', slug: 'nike', description: 'Sportswear and shoes', logo: '/logos/nike.png' },
            { name: 'Sony', slug: 'sony', description: 'Consumer electronics', logo: '/logos/sony.png' },
            { name: 'Penguin Books', slug: 'penguin-books', description: 'Popular book publisher', logo: '/logos/penguin.png' },
        ],
        skipDuplicates: true,
    });
    const [electronics, fashion, books] = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'electronics' },
            update: {},
            create: { name: 'Electronics', slug: 'electronics', description: 'Electronic gadgets' },
        }),
        prisma.category.upsert({
            where: { slug: 'fashion' },
            update: {},
            create: { name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories' },
        }),
        prisma.category.upsert({
            where: { slug: 'books' },
            update: {},
            create: { name: 'Books', slug: 'books', description: 'Fiction and non-fiction books' },
        }),
    ]);
    const products = [
        {
            name: 'iPhone 14 Pro',
            slug: 'iphone-14-pro',
            description: 'Latest Apple smartphone with advanced features.',
            price: 1199.99,
            sku: 'APL-IP14PRO',
            categoryId: electronics.id,
            brandSlug: 'apple',
        },
        {
            name: 'Samsung Galaxy S23',
            slug: 'samsung-galaxy-s23',
            description: 'Flagship Samsung phone with powerful performance.',
            price: 1099.00,
            sku: 'SMSNG-S23',
            categoryId: electronics.id,
            brandSlug: 'samsung',
        },
        {
            name: 'Nike Air Max 270',
            slug: 'nike-air-max-270',
            description: 'Stylish and comfortable running shoes.',
            price: 149.99,
            sku: 'NIKE-AM270',
            categoryId: fashion.id,
            brandSlug: 'nike',
        },
        {
            name: 'Sony WH-1000XM5',
            slug: 'sony-wh-1000xm5',
            description: 'Noise cancelling over-ear headphones.',
            price: 399.99,
            sku: 'SONY-WH1000XM5',
            categoryId: electronics.id,
            brandSlug: 'sony',
        },
        {
            name: 'The Alchemist',
            slug: 'the-alchemist',
            description: 'A novel by Paulo Coelho.',
            price: 15.99,
            sku: 'BOOK-ALCH',
            categoryId: books.id,
            brandSlug: 'penguin-books',
        },
    ];
    for (let i = 6; i <= 20; i++) {
        products.push({
            name: `Product ${i}`,
            slug: `product-${i}`,
            description: `Description for product ${i}`,
            price: 29.99 + i,
            sku: `SKU-${i}`,
            categoryId: electronics.id,
            brandSlug: 'sony',
        });
    }
    const brandMap = await prisma.brand.findMany().then((brands) => brands.reduce((acc, brand) => {
        acc[brand.slug] = brand.id;
        return acc;
    }, {}));
    await prisma.product.createMany({
        data: products.map((p) => ({
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            sku: p.sku,
            categoryId: p.categoryId,
            brandId: brandMap[p.brandSlug],
            stockQuantity: 20,
            inStock: true,
            isActive: true,
            images: ['/images/sample.jpg'],
            gallery: ['/images/sample1.jpg', '/images/sample2.jpg'],
            seoKeywords: ['sample', p.name],
        })),
    });
    console.log('✅ Seeding complete: users, brands, categories, and 20 products.');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map