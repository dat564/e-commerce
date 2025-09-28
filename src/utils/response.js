import { NextResponse } from "next/server";

export const successResponse = (data, message = "Thành công", status = 200) => {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
};

export const errorResponse = (
  message = "Lỗi server",
  status = 500,
  errors = null
) => {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
};

export const validationError = (errors) => {
  return NextResponse.json(
    {
      success: false,
      message: "Dữ liệu không hợp lệ",
      errors: Array.isArray(errors)
        ? errors
        : Object.values(errors).map((err) => err.message),
    },
    { status: 400 }
  );
};
