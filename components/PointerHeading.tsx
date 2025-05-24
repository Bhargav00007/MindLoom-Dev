import { PointerHighlight } from "../components/ui/pointer-highlight";

export function PointerHeading() {
  return (
    <div className="mx-10 lg:mx-auto max-w-lg lg:mt-70 mt-30 text-2xl text-white font-bold tracking-tight md:text-4xl">
      The best way to show your
      <PointerHighlight>
        <span>creativity</span>
      </PointerHighlight>
    </div>
  );
}
