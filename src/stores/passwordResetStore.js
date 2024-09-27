import { defineStore } from 'pinia'

export const usePasswordResetStore = defineStore('passwordReset', {
  state: () => ({
    isVerified: false,
    userId: null
  }),
  actions: {
    setVerified(status) {
      this.isVerified = status
    },
    setUserId(id) {
      this.userId = id
    },
    reset() {
      this.isVerified = false
      this.userId = null
    }
  }
})
