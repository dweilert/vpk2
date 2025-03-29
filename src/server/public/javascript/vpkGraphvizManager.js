// vpkGraphvizManager.js
(function () {
    const graphvizInstances = {};
    const contextMonitors = {};

    function renderGraph(containerId, dotData, nodeCount = 100, options = {}) {
        const { zoom = false, trackContext = false, onRenderEnd = null } = options;

        const wrapper = document.getElementById(containerId);
        if (!wrapper) {
            console.error(`renderGraph: container "${containerId}" not found`);
            return;
        }

        const height = `${Math.min(8000, Math.max(2000, nodeCount * 20))}pt`;

        // Cleanup existing instance
        try {
            if (graphvizInstances[containerId]) {
                graphvizInstances[containerId].transition().remove();
            }
        } catch (e) {
            // Ignore on first run
        }

        // Replace content with a fresh div
        wrapper.innerHTML = `<div id="${containerId}-viz" style="text-align: center;"></div>`;

        // Create and render the graph
        const viz = d3
            .select(`#${containerId}-viz`)
            .graphviz({ useWorker: false })
            .zoom(zoom)
            .height(height)
            .renderDot(dotData)
            .on('end', () => {
                if (typeof onRenderEnd === 'function') {
                    onRenderEnd();
                }
                if (trackContext && !contextMonitors[containerId]) {
                    const el = document.getElementById(`${containerId}-viz`);
                    if (el) {
                        el.addEventListener('webglcontextlost', function (e) {
                            console.warn(`🚨 WebGL context lost in ${containerId}-viz`, e);
                        });
                        contextMonitors[containerId] = true;
                    }
                }
            });

        graphvizInstances[containerId] = viz;
    }

    function clearAllGraphs() {
        Object.keys(graphvizInstances).forEach((id) => {
            try {
                graphvizInstances[id].transition().remove();
            } catch (e) {
                console.warn(`clearAllGraphs: could not remove graphviz instance for ${id}`, e);
            }
        });
    }

    // Expose globally
    window.graphvizManager = {
        renderGraph,
        clearAllGraphs,
    };
})();
