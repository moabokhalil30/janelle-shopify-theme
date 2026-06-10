document.addEventListener('DOMContentLoaded', function () {
  const productForms = document.querySelectorAll('.easify-box-builder .product-form');

  productForms.forEach(form => {
    form.addEventListener('change', function() {
      const variantSelect = form.querySelector('select[name="id"]');
      if (!variantSelect) return;
      const selectedVariant = variantSelect.value;

      const images = window.starAppsVariantImages[selectedVariant];
      if (!images || images.length === 0) return;

      const gallery = form.querySelector('.media-gallery');
      if (!gallery) return;

      gallery.innerHTML = '';

      images.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.classList.add('media-gallery__image');
        gallery.appendChild(img);
      });
    });
  });
});