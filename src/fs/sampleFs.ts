import type { FileSystem } from './types'

export const sampleFs: FileSystem = {
  name: '/',
  type: 'dir',
  children: [
    {
      name: 'games',
      type: 'dir',
      children: [
        { name: 'doom', type: 'dir', children: [{ name: 'readme.txt', type: 'file' }] },
        { name: 'duke3d', type: 'dir', children: [] },
      ],
    },
    {
      name: 'docs',
      type: 'dir',
      children: [
        { name: 'story', type: 'dir', children: [] },
        { name: 'mission1.txt', type: 'file' },
      ],
    },
    { name: 'readme.txt', type: 'file' },
  ],
}
