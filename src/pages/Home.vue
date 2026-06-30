<template>
  <div>
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">2026 湖北高职高专普通批</span>
        <h1>湖北专科志愿<br />智能推荐</h1>
        <p>输入分数和位次，快速生成湖北省内专科冲稳保志愿草表。</p>
        <div class="actions">
          <RouterLink :to="{ name: 'recommend' }"><el-button type="primary" size="large">开始查询</el-button></RouterLink>
          <RouterLink :to="{ name: 'schools' }"><el-button size="large">浏览院校库</el-button></RouterLink>
        </div>
        <p class="notice">不收集身份证、准考证号或官方填报密码，不接入官方填报系统。</p>
      </div>
      <div class="hero-panel surface-card">
        <div class="panel-title"><strong>填报辅助流程</strong><span>示意</span></div>
        <ol>
          <li><b>1</b><span><strong>填写成绩与位次</strong><small>位次优先，分数用于辅助换算</small></span></li>
          <li><b>2</b><span><strong>筛选院校和方向</strong><small>关注性质、城市、专业与风险提示</small></span></li>
          <li><b>3</b><span><strong>整理志愿草表</strong><small>分层参考，最终以官方资料为准</small></span></li>
        </ol>
      </div>
    </section>
    <section class="features">
      <article><span>01</span><h2>位次优先</h2><p>避免仅凭不同年份的裸分判断，优先参考全省位次。</p></article>
      <article><span>02</span><h2>风险可见</h2><p>逐步标记学费、计划变化、身体条件和历史数据缺失等风险。</p></article>
      <article><span>03</span><h2>本地保存</h2><p>志愿草表仅保存在当前浏览器，不要求注册或登录。</p></article>
    </section>
  </div>
</template>

<style scoped>
.hero { display: grid; grid-template-columns: 1.15fr .85fr; align-items: center; gap: 56px; min-height: 520px; padding: 36px 0 64px; }
.eyebrow { display: inline-block; border-radius: 999px; background: #eaf0ff; padding: 7px 12px; color: #3157da; font-size: 13px; font-weight: 700; }
h1 { margin: 22px 0 20px; font-size: clamp(36px, 5vw, 58px); line-height: 1.18; letter-spacing: -.035em; color: #15213d; }
.hero-copy > p { max-width: 680px; margin: 0; color: #647088; font-size: 17px; line-height: 1.9; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin: 30px 0 20px; }
.hero-copy .notice { color: #8b6330; font-size: 13px; }
.hero-panel { padding: 26px; }
.panel-title { display: flex; justify-content: space-between; margin-bottom: 20px; }
.panel-title span { color: #939bad; font-size: 12px; }
ol { margin: 0; padding: 0; list-style: none; }
li { display: flex; gap: 14px; padding: 18px 0; border-top: 1px solid #edf0f5; }
li b { display: grid; width: 34px; height: 34px; flex: 0 0 auto; place-items: center; border-radius: 10px; background: #eff3ff; color: #3a5bd5; }
li strong, li small { display: block; } li small { margin-top: 5px; color: #8a93a5; line-height: 1.5; }
.features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.features article { border-top: 3px solid #4d66d9; border-radius: 3px 3px 16px 16px; background: #fff; padding: 24px; }
.features span { color: #5670df; font-size: 13px; font-weight: 800; }.features h2 { margin: 10px 0; font-size: 19px; }.features p { margin: 0; color: #748096; line-height: 1.7; }
@media (max-width: 850px) { .hero { grid-template-columns: 1fr; gap: 28px; padding-top: 20px; } .features { grid-template-columns: 1fr; } }
</style>
