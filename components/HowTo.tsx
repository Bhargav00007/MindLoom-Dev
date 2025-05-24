import { PointerHighlight } from "../components/ui/pointer-highlight";

export function Howto() {
  return (
    <div className="lg:mx-auto mx-5 grid max-w-4xl grid-cols-1 gap-4 lg:py-20 py-10 sm:grid-cols-3 ">
      <div className="rounded-md p-6">
        <div className="h-40 w-full rounded-lg bg-gradient-to-r from-blue-200 to-sky-200 overflow-hidden flex items-center justify-center">
          <img
            src="/firstillus.png"
            alt="Banner"
            className="h-full object-cover"
          />
        </div>

        <div className="mx-auto mt-4 max-w-lg text-base text-neutral-400 font-bold tracking-tight md:text-base">
          <PointerHighlight
            rectangleClassName="bg-neutral-200  dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 leading-loose"
            pointerClassName="text-yellow-500 h-3 w-3"
            containerClassName="inline-block mr-1"
          >
            <span className="relative z-10">Sign up, write, and grow</span>
          </PointerHighlight>
          with the creative platform built for thinkers.{" "}
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          The ultimate platform to share your voice and creativity with the
          world.{" "}
        </p>
      </div>
      <div className="rounded-md p-6">
        <div className="h-40 w-full rounded-lg  bg-gradient-to-r from-blue-200 to-purple-200 flex items-center justify-center overflow-hidden">
          <img
            src="/secondillus.png"
            alt="Banner"
            className="h-full object-cover"
          />
        </div>
        <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-neutral-400">
          Explore, express, and inspire through our{" "}
          <PointerHighlight
            rectangleClassName="bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700 leading-loose"
            pointerClassName="text-blue-500 h-3 w-3"
            containerClassName="inline-block mx-1"
          >
            <span className="relative z-10">innovative </span>
          </PointerHighlight>
          blogging experience.{" "}
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Empowering self-expression through intuitive tools and a vibrant
          writing community.
        </p>
      </div>

      <div className="rounded-md p-6">
        <div
          className="h-40 w-full rounded-lg  bg-gradient-to-br from-green-200 to-yellow-200 flex items-center justify-center overflow-hidden
"
        >
          <img
            src="/thirdillus.png"
            alt="Banner"
            className="h-full object-cover"
          />
        </div>
        <div className="mx-auto mt-4 max-w-lg text-base font-bold tracking-tight md:text-base text-neutral-400">
          Create, connect, and thrive with a truly{" "}
          <PointerHighlight
            rectangleClassName="bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700 leading-loose"
            pointerClassName="text-green-500 h-3 w-3"
            containerClassName="inline-block ml-1"
          >
            <span className="relative z-10">authentic </span>
          </PointerHighlight>{" "}
          voice.
        </div>
        <p className="mt-4 text-sm text-neutral-500">
          Inspiring thoughtful content for a more connected, creative tomorrow.
        </p>
      </div>
    </div>
  );
}
