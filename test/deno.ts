import { assertStrContains, unreachable } from "std::testing";

/// @deno-types="@aduh95/viz.js/types"
import Viz from "@aduh95/viz.js";
const workerURL = "./deno-files/worker.js";

Deno.test({
  name: "Test graph rendering using Deno",
  async fn(): Promise<any> {
    const viz = await getViz();
    const svg = await viz.renderString("digraph { a -> b; }");
    assertStrContains(svg, "</svg>");
    viz.terminateWorker();
  },
});

Deno.test({
  name: "Test render several graphs with same instance",
  async fn(): Promise<any> {
    const viz = await getViz();

    let dot = "digraph {";
    let i = 0;
    dot += `node${i} -> node${i + 1};`;

    return viz
      .renderString(dot + "}")
      .then(() => {
        i++;
        dot += `node${i} -> node${i + 1};`;

        return viz.renderString(dot + "}");
      })
      .then((svg: string) => assertStrContains(svg, "</svg>"))
      .catch(unreachable)
      .finally(() => viz.terminateWorker());
  },
});

Deno.runTests();

async function getViz() {
  return new Viz({ workerURL });
}
