export const registerValidation = (data) => {
  const errors = {};

  if (!data.userName || data.userName.length < 3) {
    errors.userName = 'Username must be at least 3 characters';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
};

export const loginValidation = (data) => {
  const errors = {};

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Invalid email address';
  }

  if (!data.password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const productValidation = (data) => {
  const errors = {};

  if (!data.titleEn || data.titleEn.length < 3) {
    errors.titleEn = 'English title must be at least 3 characters';
  }
  if (!data.titleRu || data.titleRu.length < 3) {
    errors.titleRu = 'Russian title must be at least 3 characters';
  }

  if (!data.price || data.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }

  if (data.images && data.images.length > 5) {
    errors.images = 'Maximum 5 images allowed';
  }

  return errors;
};

export const reviewValidation = (data) => {
  const errors = {};

  if (!data.rating || data.rating < 1 || data.rating > 5) {
    errors.rating = 'Rating must be between 1 and 5';
  }

  if (data.comment && data.comment.length > 500) {
    errors.comment = 'Comment must be less than 500 characters';
  }

  return errors;
};
