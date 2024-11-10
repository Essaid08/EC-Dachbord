import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";



export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
) {
    try {
        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }
        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId,
            },
            include: {
                images: true,
                category: true,
                colors: true,
                sizes: true,
            }
        })
        return NextResponse.json(product)
    } catch (error) {
        console.log('[PRODUCT_GET]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {
        const { userId } = auth();
        const body = await req.json();

        const {
            name,
            price,
            stock,
            categoryId,
            colors,
            sizes,
            images,
            isFeatured,
            isArchived
        } = body;

        if (!userId) {
            return new NextResponse("Unauthenticated", { status: 403 });
        }
        if (!name) {
            return new NextResponse('Name is required', { status: 400 })
        }
        if (!images || !images.length) {
            return new NextResponse('images is required', { status: 400 })
        }
        if (!price) {
            return new NextResponse('Price Url is required', { status: 400 })
        }
        if (!stock) {
            return new NextResponse('Stock  is required', { status: 400 })
        }
        if (!categoryId) {
            return new NextResponse('Category id  is required', { status: 400 })
        }
        if (!colors || !colors.length) {
            return new NextResponse('Colors ids  is required', { status: 400 })
        }
        if (!sizes || !sizes.length) {
            return new NextResponse('Sizes ids  is required', { status: 400 })
        }

        if (!params.productId) {
            return new NextResponse("Billboard id is required", { status: 400 });
        }
        const findStoreById = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!findStoreById) {
            return new NextResponse('Unauthorized', { status: 403 })
        }

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                categoryId,
                stock,
                colors: {
                    set: colors.map((colorId: string) => ({ id: colorId }))
                },
                sizes: {
                    set: sizes.map((sizeId: string) => ({ id: sizeId }))
                },
                images: {
                    deleteMany: {}
                },
                isArchived,
                isFeatured
            }
        });
        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        })
        const productData = {
            ...product,
            price: product.price.toNumber(),
        };
        return NextResponse.json(productData);
    } catch (error) {
        console.log('[PRODUCT_PATCH]', error);
        return new NextResponse("Internal error IN PATCH", { status: 500 });
    }
};

export async function DELETE(
    req: Request,
    { params }: { params: { storeId: string, productId: string } }
) {
    try {
        const { userId } = auth()

        if (!userId) {
            return new NextResponse('Unauthencated', { status: 401 })
        }
        if (!params.productId) {
            return new NextResponse('Product id is required', { status: 400 })
        }
        const findStoreById = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })
        if (!findStoreById) {
            return new NextResponse('Unauthorized', { status: 403 })
        }
        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId,

            },
        })
        return NextResponse.json(product)

    } catch (error) {
        console.log('[PRODUCT_DELETE]', error);
        return new NextResponse("Internal error", { status: 500 })
    }
}

