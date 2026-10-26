import { useId } from "react";
import Icon from "../Icon";

export default function ModulePattern({ module }) {
  const instanceId = useId();
  const id = `pattern-${module.slug}-${instanceId}`;
  return (
    <svg
      className="module-pattern"
      width="100%"
      height="100%"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern
          id={id}
          width="240"
          height="190"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-8)"
        >
          <g transform="translate(32 38)">
            <Icon name={module.icon} size={66} />
          </g>
          <g transform="translate(165 125)">
            <Icon name={module.icon} size={35} />
          </g>
          {module.theme === "network" ? (
            <path
              d="M0 58Q35 80 63 58Q120 88 190 58Q215 69 240 58M0 69Q34 91 63 69Q120 99 190 69Q215 80 240 69"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          ) : (
            <path
              d="M98 71h36v71h28M0 142h33"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          )}
          <circle cx="134" cy="71" r="3" fill="currentColor" />
          <circle cx="33" cy="142" r="2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
