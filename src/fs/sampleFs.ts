import type { FileSystem } from './types'

export const sampleFs: FileSystem = {
  name: '/',
  type: 'dir',
  date: '1993-12-10',
  children: [
    {
      name: 'games',
      type: 'dir',
      date: '1993-12-10',
      children: [
        {
          name: 'doom',
          type: 'dir',
          date: '1993-12-10',
          children: [
            { name: 'doom.exe', type: 'file', size: 724198, date: '1993-12-10' },
            { name: 'doom.wad', type: 'file', size: 4234110, date: '1993-12-10' },
            { name: 'setup.exe', type: 'file', size: 45200, date: '1993-11-20' },
            { name: 'readme.txt', type: 'file', size: 12404, date: '1993-12-10' },
            { name: 'config.sys', type: 'file', size: 128, date: '1994-01-01' },
            { name: 'autoexec.bat', type: 'file', size: 256, date: '1994-01-01' },
          ],
        },
        { name: 'duke3d', type: 'dir', date: '1996-01-29', children: [] },
      ],
    },
    {
      name: 'docs',
      type: 'dir',
      date: '1993-12-01',
      children: [
        {
          name: 'story',
          type: 'dir',
          date: '1993-11-12',
          children: [{ name: 'chapter1.txt', type: 'file', size: 2048, date: '1993-11-12' }],
        },
        { name: 'mission1.txt', type: 'file', size: 4096, date: '1993-12-01' },
      ],
    },
    { name: 'readme.txt', type: 'file', size: 1024, date: '1993-12-10' },
  ],
}
