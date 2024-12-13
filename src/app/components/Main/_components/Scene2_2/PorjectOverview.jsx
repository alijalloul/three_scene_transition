"use client";

import { useStore } from "@/store";
import Image from "next/image";

const PorjectOverview = () => {
  const setSelectedProject = useStore((state) => state.setSelectedProject);

  return (
    <div className=" flex justify-center w-screen h-screen overflow-y-scroll backdrop-blur-md text-[#C5C4C2]">
      <div className="flex flex-col space-y-5 w-[50%] py-20 ">
        <span className="text-8xl font-medium mb-5">Expian</span>

        <div className="flex flex-col ">
          <span className="text-3xl font-medium mb-2">Project Overview</span>
          <span className="">
            Expian, formerly Ticknovate, is an experience-focused ticketing
            platform tailored to meet the complex demands of enterprise
            organisations. I was initially brought on to rapidly develop a new
            version of a support platform, which evolved into a two-year
            engagement involving a comprehensive overhaul of multiple
            interconnected platforms. During this time, I also played a key role
            in onboarding enterprise clients, and leading design initiatives at
            Expian.
          </span>
        </div>

        <div className="relative w-full aspect-[786/480] ">
          <Image src="/images/Expian-1.png" alt="Expian 1" fill />
        </div>

        <div className="flex flex-col">
          <span className="text-3xl font-medium mb-2">Key Highlights</span>
          <ul className="list-disc list-inside">
            <li>
              Created new style and design systems, which include fully
              functioning and maintained component library, with re-usable
              components for templates solutions, and structured design rules.
              Transferred the client in Figma, where created easy navigable
              design files and folders.
            </li>

            <li>
              Fully redesigned such platforms: Platform for support team members
              (Reservations), templated booking and self-service solutions for
              enterprise clients (B2C) which included 1 fully bespoke solution
              and 3 templated solutions.
            </li>

            <li>
              Developed email templates for multiple use cases (commute,
              attractions and journeys). Templates included system and booking
              emails.
            </li>

            <li>
              Re-Designed Desktop POS device (currently not implemented, only
              designed).
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <span className="text-3xl font-medium mb-2">
            Deep Dive: Reservations Portal
          </span>
          <div className="flex flex-col space-y-5">
            <span className="">
              Task: Redesign the Reservations Portal from the ground up within a
              tight timeframe, integrating new features and expanded
              functionality to enhance user experience and meet evolving needs.
            </span>

            <span className="">
              Problem: The existing support dashboard suffered from usability
              issues that reduced support team efficiency, resulting in delays
              and user frustration. Its limited functionality constrained both
              the support team's workflow and the platform's full potential,
              preventing it from meeting the needs of enterprise clients
              effectively.
            </span>

            <span className="">
              Research and Discovery: Conducted user interviews with support
              team members and analysed usage data to identify key pain points,
              such as cluttered layouts, unintuitive user flows, manual
              processes and inefficient workflows.
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-3xl font-medium mb-2">Solution Design:</span>

          <div>
            <div>
              <span className="">
                User Flows: Conducted in-depth research to develop user flows
                for the new platform, optimising usability and creating
                intuitive, seamless processes for enhanced user experience.
              </span>

              <div className="relative w-full aspect-[786/480] ">
                <Image src="/images/Expian-2.png" alt="Expian 2" fill />
              </div>
            </div>

            <div>
              <span className="">
                UI Design: Given time constraints, the process bypassed the
                wireframing stage and moved directly into UI design. This
                involved an initial UI discovery phase, followed by the creation
                of a component library to ensure design consistency. Each
                section of the platform was designed in sequence, with the main
                challenge being to ensure seamless functional integration with
                existing platforms, including the admin panel, original booking
                portal, and POS devices. This approach improved design
                efficiency by 50% for future design challenges.
              </span>

              <div className="relative w-full aspect-[786/480] mb-1 ">
                <Image src="/images/Expian-3.png" alt="Expian 3" fill />
              </div>

              <div className="relative w-full aspect-[786/240] ">
                <Image src="/images/Expian-4.png" alt="Expian 3" fill />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-3xl font-medium mb-2">
            Feature Deep Dive: Editing Flow
          </span>

          <div className="flex flex-col space-y-5">
            <span className="">
              Problem: After the initial redesign, it became evident that the
              editing flow didn’t fully address all client needs, limiting
              functionality and usability. A comprehensive revamp was necessary
              to enhance flexibility and meet diverse requirements. With no time
              constraints this time, a full design process was implemented to
              ensure an optimised and scalable solution.
            </span>

            <span className="">
              Research: Conducted data analysis and engaged with support team
              members across various clients to identify core issues. After
              pinpointing the problem areas, carried out best practices research
              and thoroughly explored potential solutions to address these
              challenges effectively.
            </span>
          </div>
        </div>

        <span className="text-2xl font-medium mb-2">Solution Design: </span>

        <span className="">
          Flow Diagrams and Wireframes: Developed flow diagrams to uncover
          weaknesses in the existing flow and explore improved solutions for the
          editing process. This was followed by hand-drawn sketches, allowing
          creative freedom to design the most effective solutions before moving
          into digital wireframes.
        </span>

        <div className="relative w-full aspect-[786/240] mb-1 ">
          <Image src="/images/Expian-5.png" alt="Expian 5" fill />
        </div>

        <span className="">
          UI Design: Following the completion of user experience research and
          design, I created multiple variations of editing screens to cover all
          potential use cases, taking into account diverse client types and
          needs. Leveraging a design system streamlined the process, reducing
          design implementation time by 60% with pre-established styles and
          components. The final solution received approval from the Head of
          Product.
        </span>

        <div className="relative w-full aspect-[786/480] mb-1 ">
          <Image src="/images/Expian-6.png" alt="Expian 6" fill />
        </div>

        <span className="text-3xl font-medium">Process Overview</span>

        <ul className="list-disc list-inside">
          <li>
            User-Centred Design Approach: Prioritised user needs by establishing
            continuous feedback loops with users to refine and optimise the
            design.
          </li>

          <li>
            Business-Centred Goals: Aligned design decisions with current
            business objectives, actively engaging with clients to ensure that
            solutions supported business success.
          </li>

          <li>
            Iterative Prototyping: Adopted an agile approach, testing and
            refining designs throughout the process to promptly address
            usability issues and enhance the user experience.{" "}
          </li>
        </ul>
      </div>

      <button
        onClick={() => {
          setSelectedProject(null);
        }}
        className=" underline fixed top-5 right-8"
      >
        Close
      </button>
    </div>
  );
};

export default PorjectOverview;
