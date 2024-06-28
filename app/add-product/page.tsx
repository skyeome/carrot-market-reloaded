"use client";

import { useState } from "react";
import Button from "@/components/button";
import Input from "@/components/input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productFormSchema } from "./schema";
import { uploadProduct } from "./actions";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productFormSchema),
  });
  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    setFile(file);
  };
  const onSubmit = handleSubmit(async (data: ProductType) => {
    if (!file) {
      setFileError("이미지를 업로드 해주세요");
      return;
    } else if (file.size > MAX_FILE_SIZE) {
      setFileError("용량이 너무 큽니다.");
      return;
    }
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("price", data.price + "");
    formData.append("description", data.description);
    formData.append("photo", file);
    const errors = await uploadProduct(formData);
    if (errors) {
      if (errors.fieldErrors.title)
        setError("title", { message: errors.fieldErrors.title?.join(" ") });
      if (errors.fieldErrors.price)
        setError("price", { message: errors.fieldErrors.price?.join(" ") });
      if (errors.fieldErrors.description)
        setError("description", {
          message: errors.fieldErrors.description?.join(" "),
        });
    }
  });
  const onValid = async () => {
    await onSubmit();
  };
  return (
    <div>
      <form action={onValid} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" && (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
              </div>
              <p className="text-red-600 text-sm">{fileError}</p>
            </>
          )}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <Input
          required
          placeholder="제목"
          type="text"
          {...register("title")}
          errors={[errors.title?.message ?? ""]}
        />
        <Input
          type="number"
          required
          placeholder="가격"
          {...register("price")}
          errors={[errors.price?.message ?? ""]}
        />
        <Input
          type="text"
          required
          placeholder="자세한 설명"
          {...register("description")}
          errors={[errors.description?.message ?? ""]}
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}
