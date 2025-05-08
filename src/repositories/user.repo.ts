export const unselectUserFields = {
  __v: 0,
  password: 0,
  refreshToken: 0,
  accessToken: 0
}

const getAllUserQuery = (limit: number, page: number) => {
  const skip = (page - 1) * limit
  return [
    {
      $lookup: {
        from: 'workspaces',
        localField: '_id',
        foreignField: 'members.user',
        as: 'workspaces'
      }
    },
    {
      $addFields: {
        numberOfWorkspaces: { $size: '$workspaces' }
      }
    },
    {
      $sort: {
        numberOfWorkspaces: -1 as const
      }
    },
    {
      $skip: skip
    },
    {
      $limit: limit
    },
    {
      $project: {
        ...unselectUserFields,
        workspaces: 0
      }
    }
  ]
}

export { getAllUserQuery }
