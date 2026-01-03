<template>
  <div class="contactview">
    <div class="contactview-content">
      <img
        alt="contactus"
        src="@/assets/special_fonts/contacts/Address.png"
        class="contactview-content-title"
      />

      
      <!-- <div class="address-block">...</div> -->

      <section class="email-block">
        <h2 class="email-title">Email us</h2>
        <p class="email-hint">
          Contact us via info below. Email addresses are formatted
          <span class="muted">@newcastle.ac.uk</span>
        </p>

        <ul class="email-list">
          <li>
            <span class="email-label">Graduate admissions, freshman-year program, and other academic inquiries:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">Diversity questions:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">Event space inquiries:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">Membership inquiries:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">Press:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">Intellectual property:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
          <li>
            <span class="email-label">General / other questions:</span>
            <a class="email-link" href="mailto:lei.shi@newcastle.ac.uk">lei.shi@newcastle.ac.uk</a>
          </li>
        </ul>
      </section>
    </div>

    <div class="contactview-map">
      <img alt="map" src="@/assets/layouts/map 1.png" class="contactview-map-address" />
    </div>
  </div>
</template>


<style scoped>
.contactview {
  width: 100%;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr; /* 默认左右两栏 */
  background: #000;
}

/* left */
.contactview-content {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  /* 自适应 padding：小屏更小，大屏更大 */
  padding: clamp(24px, 4vw, 100px);
  gap: clamp(18px, 2.2vw, 32px);

  /* 左侧内容如果太多，让左侧滚动，不影响右侧 */
  overflow: auto;
}

.contactview-content-title {
  width: clamp(160px, 18vw, 220px);
  height: auto;
  display: block;
}

/* email block */
.email-block {
  max-width: 560px;
  font-family: "Albert Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  font-weight: 400;
}

/* 标题字号做流体 */
.email-title {
  margin: 0 0 10px 0;
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
  color: #fff;
}

.email-hint {
  margin: 0 0 18px 0;
  font-size: clamp(12px, 1.1vw, 14px);
  line-height: 1.6;
  color: rgba(255,255,255,0.7);
}

.muted {
  color: rgba(255,255,255,0.55);
}

.email-list {
  margin: 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.email-list li {
  color: rgba(255,255,255,0.85);
  font-size: clamp(12px, 1.1vw, 14px);
  line-height: 1.7;

  /* 防止长邮箱/长句把布局撑爆 */
  overflow-wrap: anywhere;
}

.email-link {
  margin-left: 6px;
  color: rgba(255,255,255,0.95);
  text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.25);
}

.email-link:hover {
  border-bottom-color: rgba(255,255,255,0.8);
}

/* right */
.contactview-map {
  position: relative;
  min-height: 100svh;
}

.contactview-map-address {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 更像设计稿：铺满 */
  display: block;
}

/* ===== Responsive breakpoint：窄屏改上下布局 ===== */
@media (max-width: 900px) {
  .contactview {
    grid-template-columns: 1fr;
    grid-template-rows: auto 48svh; /* 上面内容，下面地图 */
  }

  .contactview-map {
    min-height: 48svh; /* 地图给一个可见高度 */
  }

  .email-block {
    max-width: 100%;
  }
}

/* 更小屏（手机）再紧凑一点 */
@media (max-width: 480px) {
  .email-list {
    padding-left: 14px;
    gap: 8px;
  }
}

</style>
