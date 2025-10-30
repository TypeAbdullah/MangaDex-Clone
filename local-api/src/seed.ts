import { prisma } from './lib/prisma';
import bcrypt from 'bcrypt';

async function main(){
  const pwd = await bcrypt.hash('password123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { username: 'admin', email: 'admin@example.com', password: pwd, role: 'admin' }
  });
  console.log('Admin user id:', admin.id);

  const m = await prisma.manga.upsert({
    where: { title: 'Sample Manga 1' },
    update: {},
    create: {
      title: 'Sample Manga 1',
      description: 'Seed sample manga',
      genres: ['action','adventure'],
      status: 'ongoing',
      createdBy: admin.id
    }
  });
  console.log('Seeded manga:', m.id);
}

main().catch(e=>{ console.error(e); process.exit(1); }).finally(()=>process.exit());
