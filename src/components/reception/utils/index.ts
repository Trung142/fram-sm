type PaginationModel = { page: number, pageSize: number }
export const remapForDataGrid = (
  data: Record<string, any>[],
  paginationModel: PaginationModel
) => data.map((item, index) => ({
    ...item,
    index: index + 1 + paginationModel.page * paginationModel.pageSize
}))
