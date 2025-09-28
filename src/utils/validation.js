// Validation schemas và helper functions

export const validateEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return `${fieldName} là bắt buộc`;
  }
  return null;
};

export const validateMinLength = (value, minLength, fieldName) => {
  if (value && value.length < minLength) {
    return `${fieldName} phải có ít nhất ${minLength} ký tự`;
  }
  return null;
};

export const validateMaxLength = (value, maxLength, fieldName) => {
  if (value && value.length > maxLength) {
    return `${fieldName} không được vượt quá ${maxLength} ký tự`;
  }
  return null;
};

export const validateMinValue = (value, minValue, fieldName) => {
  if (value !== undefined && value < minValue) {
    return `${fieldName} phải lớn hơn hoặc bằng ${minValue}`;
  }
  return null;
};

export const validateMaxValue = (value, maxValue, fieldName) => {
  if (value !== undefined && value > maxValue) {
    return `${fieldName} phải nhỏ hơn hoặc bằng ${maxValue}`;
  }
  return null;
};

// Validation cho user registration
export const validateUserRegistration = (data) => {
  const errors = [];

  // Validate name
  const nameError = validateRequired(data.name, "Tên");
  if (nameError) errors.push(nameError);
  else {
    const nameLengthError = validateMaxLength(data.name, 50, "Tên");
    if (nameLengthError) errors.push(nameLengthError);
  }

  // Validate email
  const emailError = validateRequired(data.email, "Email");
  if (emailError) errors.push(emailError);
  else if (!validateEmail(data.email)) {
    errors.push("Email không hợp lệ");
  }

  // Validate password
  const passwordError = validateRequired(data.password, "Mật khẩu");
  if (passwordError) errors.push(passwordError);
  else if (!validatePassword(data.password)) {
    errors.push("Mật khẩu phải có ít nhất 6 ký tự");
  }

  // Validate phone (optional)
  if (data.phone && !validatePhone(data.phone)) {
    errors.push("Số điện thoại không hợp lệ");
  }

  // Validate address (optional)
  if (data.address) {
    const addressError = validateMaxLength(data.address, 200, "Địa chỉ");
    if (addressError) errors.push(addressError);
  }

  return errors;
};

// Validation cho product
export const validateProduct = (data) => {
  const errors = [];

  // Validate name
  const nameError = validateRequired(data.name, "Tên sản phẩm");
  if (nameError) errors.push(nameError);
  else {
    const nameLengthError = validateMaxLength(data.name, 100, "Tên sản phẩm");
    if (nameLengthError) errors.push(nameLengthError);
  }

  // Validate description
  const descError = validateRequired(data.description, "Mô tả sản phẩm");
  if (descError) errors.push(descError);
  else {
    const descLengthError = validateMaxLength(
      data.description,
      1000,
      "Mô tả sản phẩm"
    );
    if (descLengthError) errors.push(descLengthError);
  }

  // Validate price
  const priceError = validateRequired(data.price, "Giá sản phẩm");
  if (priceError) errors.push(priceError);
  else {
    const priceMinError = validateMinValue(data.price, 0, "Giá sản phẩm");
    if (priceMinError) errors.push(priceMinError);
  }

  // Validate category
  const categoryError = validateRequired(data.category, "Danh mục sản phẩm");
  if (categoryError) errors.push(categoryError);

  // Validate brand
  const brandError = validateRequired(data.brand, "Thương hiệu");
  if (brandError) errors.push(brandError);

  // Validate stock
  if (data.stock !== undefined) {
    const stockMinError = validateMinValue(data.stock, 0, "Số lượng tồn kho");
    if (stockMinError) errors.push(stockMinError);
  }

  return errors;
};
