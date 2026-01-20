export const sanitizeString = (input: string): string => {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .trim();
};

export const sanitizeSearchQuery = (query: string): string => {
  return query
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/[<>'"]/g, '') // Remove quotes and angle brackets
    .trim();
};

export const validateSearchQuery = (query: string): boolean => {
  // Maximum length check
  if (query.length > 100) return false;
  
  // Check for dangerous patterns
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /eval\(/i,
    /expression\(/i,
  ];

  return !dangerousPatterns.some(pattern => pattern.test(query));
};

export const sanitizeHtml = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};


export const sanitizeEmail = (email: string): string => {
  return email.replace(/<[^>]*>/g, '').toLowerCase().trim();
};


export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validatePassword = (password: string, minLength: number = 8): boolean => {
  return password.length >= minLength;
};


export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};


export const validateRequired = (value: string): boolean => {
  return sanitizeString(value).length > 0;
};


export const validateLength = (
  value: string,
  min: number = 0,
  max: number = Infinity
): boolean => {
  const length = value.trim().length;
  return length >= min && length <= max;
};


export const validateName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};


export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};


export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(phone) && cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

export const validateForm = (
  fields: Record<string, string>,
  rules: Record<string, {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    name?: boolean;
    phone?: boolean;
    url?: boolean;
    custom?: (value: string) => boolean;
  }>
): {
  isValid: boolean;
  errors: Record<string, string>;
} => {
  const errors: Record<string, string> = {};
  
  for (const [field, value] of Object.entries(fields)) {
    const fieldRules = rules[field];
    if (!fieldRules) continue;
    
    const sanitized = sanitizeString(value);
    
    if (fieldRules.required && !validateRequired(sanitized)) {
      errors[field] = 'This field is required';
      continue;
    }
    
    if (fieldRules.email && !validateEmail(sanitized)) {
      errors[field] = 'Please enter a valid email address';
      continue;
    }
    
    if (fieldRules.name && !validateName(sanitized)) {
      errors[field] = 'Please enter a valid name';
      continue;
    }
    
    if (fieldRules.phone && !validatePhone(sanitized)) {
      errors[field] = 'Please enter a valid phone number';
      continue;
    }
    
    if (fieldRules.url && !validateUrl(sanitized)) {
      errors[field] = 'Please enter a valid URL';
      continue;
    }
    
    if (fieldRules.minLength && !validateLength(sanitized, fieldRules.minLength)) {
      errors[field] = `Must be at least ${fieldRules.minLength} characters`;
      continue;
    }
    
    if (fieldRules.maxLength && !validateLength(sanitized, 0, fieldRules.maxLength)) {
      errors[field] = `Must be no more than ${fieldRules.maxLength} characters`;
      continue;
    }
    
    if (fieldRules.custom && !fieldRules.custom(sanitized)) {
      errors[field] = 'Invalid value';
      continue;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validatePostalCode = (postalCode: string): boolean => {
  const sanitized = sanitizeString(postalCode);
  return sanitized.length >= 3 && sanitized.length <= 10 && /^[a-zA-Z0-9\s\-]+$/.test(sanitized);
};

export const validateStreet = (street: string): boolean => {
  const sanitized = sanitizeString(street);
  return sanitized.length >= 3 && sanitized.length <= 100;
};

export const validateCity = (city: string): boolean => {
  const sanitized = sanitizeString(city);
  return sanitized.length >= 2 && sanitized.length <= 50 && /^[a-zA-Z\s\-']+$/.test(sanitized);
};

export const validateImageFile = (
  file: File, 
  maxSizeMB: number = 5
): {
  isValid: boolean;
  error?: string
} => {
  const acceptedFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  if (!acceptedFormats.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Accepted formats: JPEG, PNG, GIF, WEBP`
    };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeMB}MB`
    };
  }

  const dangerousPatterns = /<script|javascript:|on\w+=/i;
  if (dangerousPatterns.test(file.name)) {
    return {
      isValid: false,
      error: "Invalid file name"
    };
  }

  return { isValid: true };
}

