import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { formatToWon } from "@/lib/utils";
import CloseButton from "@/components/close-button";
import { PhotoIcon, UserIcon } from "@heroicons/react/24/solid";
import { getIsOwner, getProduct } from "@/lib/products/getProducts";
import DeleteButton from "@/components/delete-button";

export default async function Modal({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);

  return (
    <div className="absolute w-full h-full flex justify-center items-center bg-black bg-opacity-60 left-0 top-0 z-50">
      <CloseButton />
      <div className="relative max-w-screen-sm w-full h-4/5 bg-black">
        {/* <div className="aspect-square bg-neutral-700 text-neutral-200 rounded-md flex justify-center items-center">
          <PhotoIcon className="h-28" />
        </div> */}
        <div className="h-full overflow-auto">
          <div className="pb-40">
            <div className="relative aspect-square">
              <Image
                src={product.photo}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
              <div className="size-8 rounded-full overflow-hidden">
                {product.user.avatar !== null ? (
                  <Image
                    src={product.user.avatar}
                    alt={product.user.username}
                    width={40}
                    height={40}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div>
                <h3>{product.user.username}</h3>
              </div>
            </div>
            <div className="p-5">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <p>{product.description}</p>
            </div>
          </div>
        </div>
        <div className="absolute left-0 bottom-0 w-full p-5 pb-10 bg-neutral-800 flex justify-between items-center">
          <span className="font-semibold text-lg">
            {formatToWon(product.price)}원
          </span>
          {isOwner && <DeleteButton userId={id} isOwner={isOwner} />}
          <Link
            href={``}
            className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
          >
            채팅하기
          </Link>
        </div>
      </div>
    </div>
  );
}
