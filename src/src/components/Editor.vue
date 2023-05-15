<template>
  <div class="container">
    <div class="row">
      <div class="col-8 border">
        <div id="graph"></div>
      </div>
      <div class="col-4">
        <h1>Меню управления</h1>
        <button class="btn btn-info mb-3" type="button" @click="addNode">Добавить локацию</button>
        <div class="row">
          <div class="col-12 mb-5" v-if="selectedNode!==null">
            <h2>Настройки локации</h2>

            <input type="text" class="form-control mb-1" v-model="selectedNode.data.name">
            <select class="form-control mb-2" multiple @change="addLink">
              <option v-for="link in linksNodes"
                      :value="link.id"
                      v-if="link.id!==selectedNode.id"
                      :key="link.id">{{ link.name }}</option>
            </select>

            <button class="btn btn-success" type="button" @click="updateNode">
              <i class="fa-solid fa-save"> Сохранить</i>
            </button>
          </div>

          <div class="col-12">
            <h2>Локации</h2>
            <ul class="list-group">
              <li class="list-group-item" v-for="(node,nodeIndex) in nodes" :key="nodeIndex">
                {{ node.data.name }}
                <button class="btn btn-success float-end" type="button" @click="selectedNode=nodes[nodeIndex]">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Editor',
  data () {
    return {
      graph: null,
      view: null,
      nodes: [],
      renderer: null,
      nodeTemplate: {
        id: 1,
        data: {
          name: 'test'
        }
      },
      selectedNode: null
    }
  },
  created () {
    /* eslint-disable */
    let link = document.createElement("link");
    link.href = "/static/fontawesome-6.4.0/css/all.css";
    link.type = "text/css";
    link.rel = "stylesheet";

    document.getElementsByTagName("head")[0].appendChild(link);

    this.graph = Viva.Graph.graph();
    this.view = Viva.Graph.View;

    /* eslint-enable */
  },
  mounted () {
    /* eslint-disable */
    let graphics = this.view.svgGraphics()
    graphics.node(function (node) {
      // The function is called every time renderer needs a ui to display node
      return Viva.Graph.svg('text')
        .attr('width', 24)
        .attr('height', 24)
        .text(node.data.name) // node.data holds custom object passed to graph.addNode();
    })
      .placeNode(function (nodeUI, pos) {
        // Shift image to let links go to the center:
        nodeUI.attr('x', pos.x - 12).attr('y', pos.y - 12)
      })

    // specify where it should be rendered:
    this.renderer = this.view.renderer(this.graph, {
      interactive: 'nodes',
      container: document.getElementById('graph'),
      graphics: graphics
    })
    window.test = this.renderer;
    window.graph = this.graph;

    this.renderer.run()

    /* eslint-enable */
  },
  computed: {
    linksNodes () {
      let result = []
      this.nodes.map((node) => {
        result.push({
          id: node.id,
          name: node.data.name
        })
      })
      return result
    }
  },
  methods: {
    addNode () {
      this.nodeTemplate.id++
      let tmp = JSON.parse(JSON.stringify(this.nodeTemplate))
      let newNode = this.graph.addNode(tmp.id, tmp.data)
      this.nodes.push(newNode)
    },
    addLink (event) {
      if (this.selectedNode.id !== event.target.value) {
        this.graph.addLink(this.selectedNode.id, event.target.value)
      }
    },
    updateNode () {
      this.graph.addNode(this.selectedNode.id, this.selectedNode.data)
    }

  }
}
</script>

<style>
#graph {
  width: 100%;
  height: 100vh;
}

#graph svg {
  width: inherit;
  height: inherit;
}
</style>
