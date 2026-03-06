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
  padding: 60px 20px;
  min-height: 200px;
}

.illustration {
  position: relative;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.tray {
  position: relative;
  width: 120px;
  height: 80px;
  background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
}

.paper {
  width: 60px;
  height: 70px;
  background: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  transform: translateY(-10px);
  border: 1px solid #f0f0f0;
}

.paper::before {
  content: '';
  position: absolute;
  top: 12px;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #e0e0e0;
  border-radius: 1px;
}

.paper::after {
  content: '';
  position: absolute;
  top: 22px;
  left: 10px;
  right: 10px;
  height: 2px;
  background: #e0e0e0;
  border-radius: 1px;
}

.bubble {
  position: absolute;
  top: -10px;
  right: -20px;
  width: 50px;
  height: 36px;
  background: #e8e8e8;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 12px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #e8e8e8;
}

.dots {
  color: #999;
  font-size: 20px;
  font-weight: bold;
  letter-spacing: 2px;
}

.empty-text {
  color: #999;
  font-size: 15px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  margin: 0;
}

@media (max-width: 768px) {
  .illustration {
    transform: scale(0.85);
  }
  
  .empty-text {
    font-size: 14px;
  }
}
</style>
