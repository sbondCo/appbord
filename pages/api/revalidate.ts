import { NextApiRequest, NextApiResponse } from "next";
import { getConf } from "../../utils/conf";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure request innitiator has valid api key
  const conf = getConf();
  if (req.query.api_key !== conf.api_key) {
    return res.status(401).json({ message: "Invalid token" });
  }

  console.log("handler: /api/revalidate");

  try {
    await res.unstable_revalidate("/");
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send("Error revalidating");
  }
}
