import { ref } from 'vue'

interface User {
  username: string
}

const user = ref<User | null>(null)

export function useAuth() {
  const login = (username: string) => {
    user.value = { username }
    // TODO: 把 token 存到 localStorage、cookie 等
  }
  const logout = () => {
    user.value = null
    // TODO: 清除 token
  }
  return {
    user,
    login,
    logout
  }
}
