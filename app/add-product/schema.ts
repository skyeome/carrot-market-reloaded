import { z } from "zod";

const commonSchema = {
  title: z.string({
    required_error: "상품 제목은 필수입니다.",
  }),
  description: z.string({
    required_error: "상품 설명은 필수입니다.",
  }),
  price: z.coerce.number({
    required_error: "가격은 필수입니다.",
  }),
};

export const productFormSchema = z.object(commonSchema);

export const productSchema = z.object({
  photo: z.string({
    required_error: "사진은 필수입니다.",
  }),
  ...commonSchema,
});

export type ProductType = Omit<z.infer<typeof productSchema>, "photo">;
