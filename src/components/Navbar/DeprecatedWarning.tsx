export function DeprecatedWarning() {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        left: 0,
        padding: "10px",
        backgroundColor: "#ffcc00",
        color: "#000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <span>
        <strong>Warning:</strong> This page is an old version of the Youth of
        Ōrākei website created by WDCC and is no longer maintained. The current
        version is available at{" "}
        <a
          style={{ color: "blue" }}
          href="https://youthoforakei.org.nz/"
        >
          youthoforakei.org.nz
        </a>
      </span>
    </div>
  );
}
