export default function handler(req, res) {
  res.setHeader('x-vercel-toolbar', 'disabled');
  res.status(200).end('Toolbar disabled');
}