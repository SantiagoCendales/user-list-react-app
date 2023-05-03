export const fetchUsers = async ({ pageParam = 1 }: { pageParam?: number }) => {
  const resp = await fetch(`https://randomuser.me/api?page=${pageParam}&results=10&seed=santi`)
  const data = await resp.json()
  const currentPage = Number(data.info.page)
  const nextPage = currentPage > 3 ? undefined : currentPage + 1

  return {
    users: data.results,
    nextPage
  }
}
