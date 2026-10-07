/*
  Browser-saved wishlist.
  Buttons with [data-wishlist-toggle][data-product-handle] add/remove a product.
  Saved products live in localStorage, so they stay on this device and browser only.
*/
(function () {
  if (window.JanelleWishlist) return;

  var STORAGE_KEY = 'janelle-wishlist';
  var toastTimer;

  function read() {
    try {
      var saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(saved) ? saved : [];
    } catch (error) {
      return [];
    }
  }

  function write(handles) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(handles));
    } catch (error) {
      // Storage blocked (private mode); the heart still toggles for this page view.
    }
    document.dispatchEvent(new CustomEvent('wishlist:change', { detail: { handles: handles } }));
  }

  function has(handle) {
    return read().indexOf(handle) !== -1;
  }

  function add(handle) {
    var handles = read();
    if (handles.indexOf(handle) === -1) handles.unshift(handle);
    write(handles);
  }

  function remove(handle) {
    write(
      read().filter(function (saved) {
        return saved !== handle;
      })
    );
  }

  function syncButtons() {
    var handles = read();
    document.querySelectorAll('[data-wishlist-toggle]').forEach(function (button) {
      var active = handles.indexOf(button.dataset.productHandle) !== -1;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function showToast(message, linkUrl, linkLabel) {
    var toast = document.getElementById('WishlistToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'WishlistToast';
      toast.className = 'wishlist-toast';
      toast.setAttribute('role', 'status');
      document.body.appendChild(toast);
    }
    toast.innerHTML = '';
    var text = document.createElement('span');
    text.textContent = message;
    toast.appendChild(text);
    if (linkUrl) {
      var link = document.createElement('a');
      link.href = linkUrl;
      link.textContent = linkLabel;
      toast.appendChild(link);
    }
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 3000);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-wishlist-toggle]');
    if (!button) return;
    event.preventDefault();

    var handle = button.dataset.productHandle;
    if (has(handle)) {
      remove(handle);
      showToast(button.dataset.removedText || 'Removed from wishlist');
    } else {
      add(handle);
      showToast(
        button.dataset.addedText || 'Added to wishlist',
        button.dataset.wishlistUrl,
        button.dataset.viewText || 'View'
      );
    }
  });

  document.addEventListener('wishlist:change', syncButtons);
  document.addEventListener('DOMContentLoaded', syncButtons);
  window.addEventListener('pageshow', syncButtons);
  syncButtons();

  window.JanelleWishlist = { read: read, has: has, add: add, remove: remove, sync: syncButtons };
})();
