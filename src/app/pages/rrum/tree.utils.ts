import * as _ from 'lodash';
export class TreeUtils {
  /**
   * 根据节点id获取到节点
   * @param treeModel 树节点模型
   * @param id 树节点模型
   * @returns {any} 节点引用，如果为找到，返回null
   */
  public static getNodeRefById(treeModel, id): any {
    let nodeRef = null;
    // let callTimes = 0;
    function findNodeRefById(node) {
      if (node.id === id) {
        nodeRef = node;
      }else {
        if (Array.isArray(node.children) && node.children.length > 0) {
          for (const child of node.children) {
            findNodeRefById(child);
            if (nodeRef !== null) {
              break;
            }
          }
        }
      }
      // callTimes++;
      // console.log(node.th, node.id, callTimes);
    }
    findNodeRefById(treeModel);
    return nodeRef;
  }

  public static getNextChildId(node, id) {
    // const nodeRef = this.getNodeRefById(tree, id);
    if (node) {
      let maxId = id;
      if (!_.isEmpty(node.children)) {
        maxId = _.maxBy(node.children, function(_node){
          return _node.id;
        });
        /*
        if (maxId === undefined) {
          maxId = 100 * id;
          // maxId = Math.floor(id);
        }// */
        /*
        let str = maxId.toString();
        const idStart = +str.substr(0, str.indexOf('.') - 1);
        str = str.substr(str.indexOf('.'));
        const len = str.length;
        let idEnd = +str * Math.pow(10, len - 1);
        idEnd += 1;
        idEnd /= Math.pow(10, len - 1);
        return idStart + idEnd; // */
      }else {
        maxId = 100 * id;
        // maxId = Math.ceil(id);
        // return maxId + 0.1;
      }
      // console.log('maxId=', maxId);
      return 1 + (maxId.id ? maxId.id : maxId);
    }
    console.log('id=', id);
    return -1;
  }

  public static updateTreeModel(node, newNode) {
    // const nodeRef = this.getNodeRefById(tree, id);
    if (node) {
      if (Array.isArray(node.children)) {
        node.children.push(newNode);
      }else {
        node['children'] = [newNode];
      }
    }
  }

  public static convertMenuData(nodes): any {
    // console.log(JSON.stringify(nodes, null, 2));
    const menuTree = {
      pid: -1,
      id: 0,
      th: 0,
      value: 'MenuRoot',
      link: '/pages',
      settings: {isCollapsedOnInit: false, leftMenu: false, rightMenu: false},
      title: 'menu',
      children: nodes
    };
    // menuTree.children = [...nodes];
    // 这里实现对树的内部数据的自动填充：_id:id,_pid:pid,_th:th
    function parserMenuNode(node) {
      if (_.isArray(node.children)) {
        let i = 1;
        const idStart = 100 * (node.id);
        // 填充子节点的pid、th、id,将value赋值为title
        _.each(node.children, function (cn) {
          cn.pid = node.id;
          cn.th = node.th + 1;
          cn.id = idStart + i;
          cn.value = cn.title;
          i++;
          parserMenuNode(cn);
        });
      } else {
        node['children'] = [];
      }
    }
    // 递归调用 here
    parserMenuNode(menuTree);
    return menuTree;
  }

  public static convertOldMenu(nodes): any {
    const menuTree = {
        link: '/pages',
        title: 'menu',
        children: []
    };
    menuTree.children = [...nodes];
    // 这里实现对树的内部数据的自动填充：_id:id,_pid:pid,_th:th
    function parserMenuNode(node) {
        if (_.isArray(node.children)) {
            let i = 1;
            const idStart = 100 * (node.id);
            // const idStart = +[node.th, Math.ceil(node.id)].join('');
            _.each(node.children, function (cn) {
                // cn.pid = node.id;
                // cn.th = node.th + 1;
                // cn.id = idStart + i;
                // cn.id = [idStart , i].join('.');
                if (cn.hasOwnProperty('path')) {
                    cn.link = node.link + '/' + cn.path;
                    delete cn.path;
                }
                if (cn.hasOwnProperty('data')) {
                    const data = cn.data;
                    if (data.hasOwnProperty('menu')) {
                        const menu = data.menu;
                        // cn.value = menu.title;
                        cn.title = menu.title;
                        cn.icon = menu.icon;
                    }
                    delete cn.data;
                }
                i++;
                parserMenuNode(cn);
            });
        } else {
            // node['children'] = [];
        }
    }
    // 递归调用 here
    parserMenuNode(menuTree);
    return menuTree;
  }

  public static getParentNodes(treeModel, pid) {
    const parentNodes = [];
    let nodeRef = this.getNodeRefById(treeModel, pid);
    function appendParent(_nodeRef) {
      const nodeClone = _.clone(_nodeRef);
      delete nodeClone.children;
      parentNodes.push(nodeClone);
    }
    if (nodeRef.th > 0) {
      appendParent(nodeRef);
    }
    if (nodeRef.th > 1) {
      for (let i = nodeRef.th; i > 1; i--) {
        nodeRef = this.getNodeRefById(treeModel, nodeRef.pid);
        if (nodeRef) {
          appendParent(nodeRef);
        }
      }
    }
    return parentNodes;
  }

  public static getSelectedNode(treeModel) {
    const selectedNodes = [];
    function getSelectedNodes(nodes) {
      _.each(nodes, function(node) {
        if (node.selected === true) {
          const nodeClone = _.clone(node);
          delete nodeClone.children;
          selectedNodes.push(nodeClone);
        }
        if (_.isArray(node.children)) {
          getSelectedNodes(node.children);
        }
      });
    }
    getSelectedNodes(treeModel.children);
    return _.sortBy(selectedNodes,  ['th', 'pid', 'id']);
  }

  public static getAssignedNode(treeModel, assignedIds: number[]) {
    const selectedNodes = [];
    function getSelectedNodes(nodes) {
      _.each(nodes, function(node) {
        if (_.includes(assignedIds, node.id)) {
          const nodeClone = _.clone(node);
          delete nodeClone.children;
          selectedNodes.push(nodeClone);
        }
        if (_.isArray(node.children)) {
          getSelectedNodes(node.children);
        }
      });
    }
    getSelectedNodes(treeModel.children);
    return _.sortBy(selectedNodes,  ['th', 'pid', 'id']);
  }

  public static getRelatedSelectedNodes(treeModel, sortedSelectedNodes) {
    const selectedNodes = [...sortedSelectedNodes];

    _.each(sortedSelectedNodes, (node) => {
      // console.log(node.pid, node.id, node.th);
      if (node.pid !== -1) {
        // 获取节点的父节点列表。
        const parentNodes = TreeUtils.getParentNodes(treeModel, node.pid);
        // console.log('this.parentNodes:', JSON.stringify(parentNodes, null, 2));
        _.each(parentNodes, (pn) => {
          // 确保父辈节点不会被重复记录。
          const epn = _.find(selectedNodes, (sn) => {
            return sn.id === pn.id;
          });
          if (epn === undefined) {
            selectedNodes.push(pn);
          }
        });
      }
    });
    return _.sortBy(selectedNodes, ['th', 'pid', 'id']);
  }

  public static buildTreeModel(sortedSelectedNodes) {
    const newTree = {pid: -1, id: 0, th: 0, value: 'NewTreeRoot', children: []};
    // 获取树高信息
    const tmpTH = [];
    _.each(sortedSelectedNodes, (node) => {
      node.selected = false;
      tmpTH.push(node.th);
    });
    const treeHeightInfo = _.sortedUniq(tmpTH);
    // console.log('treeHeightInfo:', treeHeightInfo);
    _.each(treeHeightInfo, (th) => {
      const nodes = [];
      _.each(sortedSelectedNodes, (node) => {
        if (node.th === th) {
          nodes.push(node);
        }
      });
      // console.log(th, nodes);
      if (th <= treeHeightInfo[0]) {
        // 将nodes直接添加到newTreeModel
        _.each(nodes, function (node) {
          newTree.children.push(node);
        });
      }else {
        // 找到上层节点列表。
        const parentNodes = [];
        _.each(sortedSelectedNodes, (node) => {
          if (node.th === th - 1) {
            parentNodes.push(node);
          }
        });
        // 逐个匹配父节点，然后添加。
        _.each(nodes, (node) => {
          // 搜索直系父节点。
          const fatherNode = _.find(parentNodes, (pn) => {
            return pn.id === node.pid;
          });
          if (fatherNode) {
            if (fatherNode.hasOwnProperty('children')) {
              fatherNode.children.push(node);
            }else {
              fatherNode.children = [node];
            }
          }
        });
      }
    });
    // console.log('newTree', JSON.stringify(newTree, null, 2));
    return newTree;
  }

  public static  cvtTree2Menu(treeModel) {
    // 递归转换节点的方法
    function cvtNode(treeNode) {
      const menuNode = {};
      _.each(treeNode, function(nodeValue, key) {
        // 复制link,icon属性
        if (_.includes('icon,id', key)) {
          menuNode[key] = nodeValue;
        }
        // 根据link值是否为外链，执行不同的复制
        if (key === 'link') {
          if (nodeValue.toString().toLowerCase().trim().startsWith('http')) {
            menuNode['url'] = nodeValue;
            menuNode['target'] = _.uniqueId('ex_');
          }else {
            menuNode['link'] = nodeValue;
          }
        }
        // 将value属性存储为title
        if (key === 'value') {
          menuNode['title'] = nodeValue;
        }
        // 递归处理子节点
        if (key === 'children') {
          if (_.isEmpty(nodeValue)) {
            menuNode['children'] = [];
          }else {
            const menuChildren = [];
            _.each(nodeValue, function(_treeNode){
              menuChildren.push(cvtNode(_treeNode));
            });
            menuNode['children'] = menuChildren;
          }
        }
      });
      return menuNode;
    }

    const  menuData = [];
    _.each(treeModel.children, (treeNode) => {
      menuData.push(cvtNode(treeNode));
    });
    return menuData;
  }
}

