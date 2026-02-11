<template>
  <div class="contactview">
    <div class="contactview-content">
      <h1 class="contactview-title">CONTACT</h1>

      <!-- Address -->
      <section class="contact-block">
        <h2 class="block-title">Address</h2>
        <address class="address-text">
          Open Lab, Floor 1<br>
          Urban Sciences Building<br>
          Newcastle Helix<br>
          Newcastle upon Tyne<br>
          NE4 5TG
        </address>
      </section>

      <!-- Contact Person -->
      <section class="contact-block">
        <h2 class="block-title">Project Lead</h2>
        <p class="contact-name">Dr Lei Shi</p>
        <p class="contact-role">Director of Haii Lab, Associate Professor</p>
        <div class="contact-details">
          <div class="contact-row">
            <span class="contact-label">E:</span>
            <a class="contact-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </div>
          <div class="contact-row">
            <span class="contact-label">P:</span>
            <a class="contact-link" href="tel:+441912084630">+44 (0) 191 20 84630</a>
          </div>
        </div>
      </section>

      <!-- Links -->
      <section class="contact-block">
        <h2 class="block-title">Find Us</h2>
        <div class="contact-links">
          <a class="ext-link" href="https://scholar.google.com/citations?user=t6vecXsAAAAJ&hl=en" target="_blank" rel="noreferrer">Google Scholar ↗</a>
          <a class="ext-link" href="https://www.linkedin.com/in/lsncl/" target="_blank" rel="noreferrer">LinkedIn ↗</a>
          <a class="ext-link" href="https://shilei.me" target="_blank" rel="noreferrer">Personal Website ↗</a>
        </div>
      </section>
    </div>

    <div class="contactview-map">
      <iframe
        class="contactview-map-embed"
        src="https://www.google.com/maps?q=Urban+Sciences+Building,+1+Science+Square,+Newcastle+upon+Tyne,+NE4+5TG&output=embed"
        allowfullscreen=""
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  </div>
</template>


<style scoped>
.contactview {
  width: 100%;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: #000;
}

/* left */
.contactview-content {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: clamp(24px, 4vw, 100px);
  gap: clamp(28px, 3.5vw, 48px);
  overflow: auto;
}

.contactview-title {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 700;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0;
}

/* Shared block styles */
.contact-block {
  max-width: 560px;
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
}

.block-title {
  margin: 0 0 clamp(10px, 1.2vw, 16px) 0;
  font-size: clamp(18px, 1.8vw, 24px);
  font-weight: 600;
  color: #fff;
}

/* Address */
.address-text {
  font-style: normal;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.75);
}

/* Contact person */
.contact-name {
  margin: 0 0 4px 0;
  font-size: clamp(16px, 1.4vw, 20px);
  font-weight: 600;
  color: #fff;
}

.contact-role {
  margin: 0 0 clamp(12px, 1.5vw, 18px) 0;
  font-size: clamp(13px, 1.1vw, 15px);
  color: rgba(255, 255, 255, 0.55);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: clamp(13px, 1.1vw, 15px);
}

.contact-label {
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  flex-shrink: 0;
}

.contact-link {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  transition: border-color 0.2s ease;
}

.contact-link:hover {
  border-bottom-color: rgba(255, 255, 255, 0.8);
}

/* External links */
.contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(12px, 1.5vw, 20px);
}

.ext-link {
  font-family: 'Albert Sans', system-ui, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif;
  font-size: clamp(13px, 1.1vw, 15px);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: clamp(8px, 1vw, 12px) clamp(16px, 1.5vw, 24px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 50px;
  transition: all 0.2s ease;
}

.ext-link:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.6);
}

/* right */
.contactview-map {
  position: relative;
  min-height: 100svh;
}

.contactview-map-embed {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  filter: grayscale(1) invert(1) contrast(1.2) brightness(0.6);
}

/* Responsive */
@media (max-width: 900px) {
  .contactview {
    grid-template-columns: 1fr;
    grid-template-rows: auto 48svh;
  }

  .contactview-map {
    min-height: 48svh;
  }

  .contact-block {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .contact-links {
    flex-direction: column;
    gap: 10px;
  }

  .ext-link {
    text-align: center;
  }
}
</style>
