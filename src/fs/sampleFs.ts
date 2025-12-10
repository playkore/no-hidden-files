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
        {
          name: 'qbert',
          type: 'dir',
          date: '1989-05-10',
          children: [
            { name: 'qbert.exe', type: 'file', size: 90112, date: '1989-05-10' },
            { name: 'pyramid.dat', type: 'file', size: 16384, date: '1989-05-08' },
            { name: 'sprites.qb', type: 'file', size: 24576, date: '1989-05-07' },
            { name: 'sounds.bin', type: 'file', size: 8192, date: '1989-05-05' },
            { name: 'qbert.cfg', type: 'file', size: 512, date: '1989-05-01' },
            { name: 'readme.txt', type: 'file', size: 1792, date: '1989-05-01' },
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
