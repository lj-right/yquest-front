<template>
  <div class="empty-state">
    <div class="illustration">
      <div class="tray">
        <div class="paper"></div>
      </div>
      <div class="bubble">
        <span class="dots">...</span>
      </div>
    </div>
    <p class="empty-text">你已查看所有通知</p>
  </div>
</template>

<script>
export default {
  name: 'EmptyState'
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-14) var(--space-5);
  min-height: 200px;
}

.illustration {
  position: relative;
  margin-bottom: var(--space-6);
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

.tray {
  width: 100px;
  height: 68px;
  background: linear-gradient(180deg, var(--color-border) 0%, #CBD5E1 100%);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  justify-content: center;
}

.paper {
  width: 52px;
  height: 60px;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-xs);
  transform: translateY(-8px);
  border: 1px solid var(--color-border);
}

.paper::before {
  content: '';
  position: absolute;
  top: 12px; left: 8px; right: 8px;
  height: 2px;
  background: var(--color-border);
  border-radius: 1px;
}

.paper::after {
  content: '';
  position: absolute;
  top: 22px; left: 8px; right: 8px;
  height: 2px;
  background: var(--color-border);
  border-radius: 1px;
}

.bubble {
  position: absolute;
  top: -8px; right: -16px;
  width: 44px; height: 32px;
  background: var(--color-border);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-xs);
}

.bubble::after {
  content: '';
  position: absolute;
  bottom: -5px; left: 10px;
  width: 0; height: 0;
  border-left: 7px solid transparent;
  border-right: 7px solid transparent;
  border-top: 7px solid var(--color-border);
}

.dots {
  color: var(--color-text-tertiary);
  font-size: 18px;
  font-weight: var(--font-bold);
  letter-spacing: 2px;
}

.empty-text {
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  font-family: var(--font-family);
  margin: 0;
}

@media (max-width: 768px) {
  .illustration { transform: scale(0.85); }
  .empty-text { font-size: var(--text-sm); }
}
</style>
