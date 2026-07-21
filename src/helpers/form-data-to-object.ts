function formDataToObject<T>(formData: FormData): T {
  return Object.fromEntries(formData) as T;
}
