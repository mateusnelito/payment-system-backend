// Dynamic import for nanoid
export async function generateNanoId(): Promise<string> {
  const { nanoid } = await require('nanoid');
  return nanoid(10);
}
