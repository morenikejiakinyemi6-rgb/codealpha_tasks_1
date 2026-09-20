import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import Nav from "../Nav"
import Footer from "../Footer"
import MeasurementForm from "./MeasurementForm"

export default async function MeasurementsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <div className="p-8">Please log in.</div>
  }

  const measurement = await prisma.measurement.findUnique({
    where: { userId: session.user.id },
  })

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Nav />
      <section className="px-8 py-16 flex-1 max-w-md max-w-6xl mx-auto">
        <h1 className="font-display text-2xl text-ink mb-8">Your Measurements</h1>
        <MeasurementForm existing={measurement} />
      </section>
      <Footer />
    </div>
  )
}