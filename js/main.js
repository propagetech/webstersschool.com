(function () {
  "use strict";

  function initTheme() {
    var themeToggle = document.querySelector(".theme-toggle");
    var html = document.documentElement;
    var saved = localStorage.getItem("theme");
    if (saved === "dark") {
      html.setAttribute("data-theme", "dark");
    } else {
      html.setAttribute("data-theme", "light");
    }
    if (themeToggle) {
      themeToggle.addEventListener("click", function () {
        var current = html.getAttribute("data-theme");
        var next = current === "dark" ? "light" : "dark";
        html.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        themeToggle.setAttribute(
          "aria-label",
          next === "dark" ? "Switch to light mode" : "Switch to dark mode",
        );
      });
      var theme = html.getAttribute("data-theme");
      themeToggle.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      );
    }
  }

  function initMenu() {
    var menuToggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("main-navigation");
    if (!menuToggle || !nav) return;
    menuToggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", !isOpen);
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open menu" : "Close menu",
      );
    });
    document.addEventListener("click", function (e) {
      if (
        nav.classList.contains("open") &&
        !nav.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open menu");
        menuToggle.focus();
      }
    });
  }

  function initSkipLink() {
    var skip = document.querySelector(".skip-link");
    if (!skip) return;
    skip.addEventListener("click", function (e) {
      var id = this.getAttribute("href");
      if (id && id !== "#") {
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  }

  function initScrollUp() {
    var btn = document.querySelector(".scroll-up");
    if (!btn) return;
    function update() {
      if (window.scrollY > 300) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setAriaCurrent() {
    var path = window.location.pathname;
    var navLinks = document.querySelectorAll("nav#main-navigation a[href]");
    navLinks.forEach(function (link) {
      try {
        var url = new URL(link.href);
        var linkPath = url.pathname;
        var isHome =
          path === "/" || path.endsWith("/index.html") || path === "";
        var isLinkHome = linkPath === "/" || linkPath.endsWith("/index.html");
        if (linkPath === path || (isHome && isLinkHome)) {
          link.setAttribute("aria-current", "page");
        } else {
          link.removeAttribute("aria-current");
        }
      } catch (_) {}
    });
  }

  function initLazyImages() {
    var images = document.querySelectorAll('img[loading="lazy"]');
    if ("loading" in HTMLImageElement.prototype) {
      images.forEach(function (img) {
        img.addEventListener("load", function () {
          this.classList.add("loaded");
        });
        if (img.complete) img.classList.add("loaded");
      });
    } else {
      images.forEach(function (img) {
        img.classList.add("loaded");
      });
    }
  }

  // Custom fullscreen gallery lightbox: play/pause, thumbnails bottom middle, exit bottom right
  function initLightbox() {
    var galleryLinks = document.querySelectorAll(
      ".gallery-item-wrapper a[data-lightbox='gallery']",
    );
    if (galleryLinks.length === 0) return;

    var items = Array.from(galleryLinks).map(function (link) {
      var img = link.querySelector("img");
      return {
        href: link.getAttribute("href"),
        alt: img ? img.getAttribute("alt") || "" : "",
        thumbSrc: link.getAttribute("href"),
      };
    });

    var SLIDESHOW_INTERVAL_MS = 4000;
    var currentIndex = 0;
    var slideshowTimer = null;
    var lightboxEl = null;
    var mainImageEl = null;
    var captionEl = null;
    var playPauseBtn = null;
    var thumbStrip = null;

    function buildLightbox() {
      if (lightboxEl) return lightboxEl;
      var overlay = document.createElement("div");
      overlay.className = "gallery-lightbox";
      overlay.setAttribute("role", "dialog");
      overlay.setAttribute("aria-modal", "true");
      overlay.setAttribute("aria-label", "Image gallery");

      var mainWrap = document.createElement("div");
      mainWrap.className = "gallery-lightbox__main";
      mainImageEl = document.createElement("img");
      mainImageEl.className = "gallery-lightbox__image";
      mainImageEl.setAttribute("alt", "");
      captionEl = document.createElement("p");
      captionEl.className = "gallery-lightbox__caption";
      mainWrap.appendChild(mainImageEl);
      mainWrap.appendChild(captionEl);

      var bottomBar = document.createElement("div");
      bottomBar.className = "gallery-lightbox__bottom-bar";

      playPauseBtn = document.createElement("button");
      playPauseBtn.type = "button";
      playPauseBtn.className = "gallery-lightbox__play-pause";
      playPauseBtn.setAttribute("aria-label", "Play slideshow");
      playPauseBtn.innerHTML =
        '<span class="gallery-lightbox__play-icon" aria-hidden="true"></span><span class="gallery-lightbox__pause-icon" aria-hidden="true"></span>';
      playPauseBtn.addEventListener("click", togglePlayPause);

      thumbStrip = document.createElement("div");
      thumbStrip.className = "gallery-lightbox__thumbs";
      thumbStrip.setAttribute("role", "tablist");
      items.forEach(function (item, i) {
        var thumb = document.createElement("button");
        thumb.type = "button";
        thumb.className = "gallery-lightbox__thumb";
        thumb.setAttribute("role", "tab");
        thumb.setAttribute("aria-label", "Image " + (i + 1));
        thumb.setAttribute("data-index", String(i));
        var thumbImg = document.createElement("img");
        thumbImg.src = item.thumbSrc;
        thumbImg.alt = "";
        thumbImg.loading = "eager";
        thumb.appendChild(thumbImg);
        thumb.addEventListener("click", function () {
          goToIndex(i);
        });
        thumbStrip.appendChild(thumb);
      });

      var exitBtn = document.createElement("button");
      exitBtn.type = "button";
      exitBtn.className = "gallery-lightbox__exit";
      exitBtn.setAttribute("aria-label", "Exit full screen");
      exitBtn.innerHTML = '<span aria-hidden="true">&times;</span>';
      exitBtn.addEventListener("click", closeLightbox);

      var thumbsCenter = document.createElement("div");
      thumbsCenter.className = "gallery-lightbox__thumbs-center";
      thumbsCenter.appendChild(thumbStrip);

      bottomBar.appendChild(playPauseBtn);
      bottomBar.appendChild(thumbsCenter);
      bottomBar.appendChild(exitBtn);

      overlay.appendChild(mainWrap);
      overlay.appendChild(bottomBar);
      document.body.appendChild(overlay);
      lightboxEl = overlay;
      return overlay;
    }

    function updateMainImage() {
      if (!mainImageEl || !captionEl) return;
      var item = items[currentIndex];
      mainImageEl.src = item.href;
      mainImageEl.alt = item.alt;
      captionEl.textContent = item.alt || "";
      captionEl.style.display = item.alt ? "block" : "none";
      updateThumbActive();
    }

    function updateThumbActive() {
      if (!thumbStrip) return;
      var thumbs = thumbStrip.querySelectorAll(".gallery-lightbox__thumb");
      thumbs.forEach(function (thumb, i) {
        var isActive = i === currentIndex;
        thumb.setAttribute("aria-selected", isActive ? "true" : "false");
        thumb.classList.toggle("gallery-lightbox__thumb--active", isActive);
        if (isActive) {
          thumb.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      });
    }

    function goToIndex(index) {
      currentIndex = (index + items.length) % items.length;
      updateMainImage();
    }

    function next() {
      goToIndex(currentIndex + 1);
    }

    function prev() {
      goToIndex(currentIndex - 1);
    }

    function startSlideshow() {
      if (slideshowTimer) return;
      slideshowTimer = setInterval(next, SLIDESHOW_INTERVAL_MS);
      if (playPauseBtn) {
        playPauseBtn.classList.add("gallery-lightbox__play-pause--playing");
        playPauseBtn.setAttribute("aria-label", "Pause slideshow");
      }
    }

    function stopSlideshow() {
      if (slideshowTimer) {
        clearInterval(slideshowTimer);
        slideshowTimer = null;
      }
      if (playPauseBtn) {
        playPauseBtn.classList.remove("gallery-lightbox__play-pause--playing");
        playPauseBtn.setAttribute("aria-label", "Play slideshow");
      }
    }

    function togglePlayPause() {
      if (slideshowTimer) {
        stopSlideshow();
      } else {
        startSlideshow();
      }
    }

    function openLightbox(index) {
      buildLightbox();
      currentIndex = (index + items.length) % items.length;
      updateMainImage();
      lightboxEl.classList.add("gallery-lightbox--open");
      stopSlideshow();
      document.body.style.overflow = "hidden";
      if (lightboxEl.requestFullscreen) {
        lightboxEl.requestFullscreen().catch(function () {});
      }
      document.addEventListener("keydown", handleLightboxKeydown);
    }

    function closeLightbox() {
      if (!lightboxEl) return;
      if (
        document.fullscreenElement === lightboxEl &&
        document.exitFullscreen
      ) {
        document.exitFullscreen().catch(function () {});
      }
      lightboxEl.classList.remove("gallery-lightbox--open");
      document.body.style.overflow = "";
      stopSlideshow();
      document.removeEventListener("keydown", handleLightboxKeydown);
    }

    function handleLightboxKeydown(e) {
      if (
        !lightboxEl ||
        !lightboxEl.classList.contains("gallery-lightbox--open")
      ) {
        return;
      }
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    }

    galleryLinks.forEach(function (link, index) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        openLightbox(index);
      });
    });

    document.addEventListener("fullscreenchange", function () {
      if (
        !document.fullscreenElement &&
        lightboxEl &&
        lightboxEl.classList.contains("gallery-lightbox--open")
      ) {
        closeLightbox();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  function run() {
    initTheme();
    initMenu();
    initSkipLink();
    initScrollUp();
    setAriaCurrent();
    initLazyImages();
    initLightbox();
  }
})();
