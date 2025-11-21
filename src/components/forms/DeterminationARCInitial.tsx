import React, { useRef, useEffect } from 'react';
import { Tooltip } from '../common/Tooltip';
import { RiskAssessmentInfo, airspaceClasses, OperationalVolumeLevel, AdjacentVolumeLevel } from '../../types/sora';
import { HelpCircle } from 'lucide-react';

interface DeterminationARCInitialProps {
  assessment: RiskAssessmentInfo;
  onChange: (assessment: RiskAssessmentInfo) => void;
}

export function DeterminationARCInitial({ assessment, onChange }: DeterminationARCInitialProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const checkboxes = [
    'Classe - A',
    'Classe - B',
    'Classe - C',
    'Classe - D',
    'Classe - E',
    'Classe - F',
    'Classe - G',
    'U-Space',
    'Autre, Préciser',
  ];

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear any existing content and global functions
    chartRef.current.innerHTML = '';

    // Clean up any existing global functions
    delete window.goBack;
    delete window.resetQuestionnaire;
    delete window.handleModalAnswer;
    delete window.closeModal;

    // Enhanced questionnaire data structure
    const flowData = {
      currentNode: 'start',
      nodes: {
        'start': {
          type: 'question',
          text: 'OPS in Atypical Airspace?',
          x: 80, y: 120,
          yes: 'arc-a',
          no: 'q2'
        },
        'q2': {
          type: 'question',
          text: 'OPS > FL600?',
          x: 80, y: 300,
          yes: 'arc-b',
          no: 'q3'
        },
        'q3': {
          type: 'question',
          text: 'OPS in Airport or Heliport Environment ?',
          x: 80, y: 480,
          yes: 'q4',
          no: 'q5'
        },
        'q4': {
          type: 'question',
          text: 'OPS in Class B, C or D Airspace?',
          x: 280, y: 480,
          yes: 'arc-d-1',
          no: 'arc-c-1'
        },
        'q5': {
          type: 'question',
          text: 'OPS > 500 ft AGL but < FL600',
          x: 80, y: 930,
          yes: 'q6',
          no: 'ops-500'
        },
        'q6': {
          type: 'question',
          text: 'OPS in Mode-C Veil or TMZ',
          x: 280, y: 930,
          yes: 'arc-d-2',
          no: 'q7'
        },
        'q7': {
          type: 'question',
          text: 'OPS in Controlled Airspace?',
          x: 490, y: 930,
          yes: 'arc-d-3',
          no: 'q8'
        },
        'q8': {
          type: 'question',
          text: 'OPS in Uncontrolled Airspace over Urban Area?',
          x: 700, y: 930,
          yes: 'arc-c-4',
          no: 'rural-ops-1'
        },
        'ops-500': {
          type: 'intermediate',
          text: 'OPS < 500 ft AGL',
          x: 80, y: 1230,
          next: 'q6-low'
        },
        'q6-low': {
          type: 'question',
          text: 'OPS in Mode-C Veil or TMZ',
          x: 280, y: 1230,
          yes: 'arc-c-5',
          no: 'q7-low'
        },
        'q7-low': {
          type: 'question',
          text: 'OPS in Controlled Airspace?',
          x: 490, y: 1230,
          yes: 'arc-c-6',
          no: 'q8-low'
        },
        'q8-low': {
          type: 'question',
          text: 'OPS in Uncontrolled Airspace over Urban Area?',
          x: 700, y: 1230,
          yes: 'arc-c-7',
          no: 'rural-ops-2'
        },
        'arc-a': { type: 'result', text: 'ARC-a', x: 280, y: 120, class: 'arc-a' },
        'arc-b': { type: 'result', text: 'ARC-b', x: 280, y: 300, class: 'arc-b' },
        'arc-c-1': { type: 'result', text: 'ARC-c', x: 280, y: 630, class: 'arc-c' },
        'arc-d-1': { type: 'result', text: 'ARC-d', x: 490, y: 480, class: 'arc-d' },
        'arc-d-2': { type: 'result', text: 'ARC-d', x: 280, y: 795, class: 'arc-d' },
        'arc-d-3': { type: 'result', text: 'ARC-d', x: 490, y: 795, class: 'arc-d' },
        'arc-c-4': { type: 'result', text: 'ARC-c', x: 700, y: 795, class: 'arc-c' },
        'arc-c-5': { type: 'result', text: 'ARC-c', x: 280, y: 1095, class: 'arc-c' },
        'arc-c-6': { type: 'result', text: 'ARC-c', x: 490, y: 1095, class: 'arc-c' },
        'arc-c-7': { type: 'result', text: 'ARC-c', x: 700, y: 1095, class: 'arc-c' },
        'rural-ops-1': {
          type: 'result',
          text: 'Operations in Uncontrolled Airspace over Rural Areas',
          x: 950, y: 930,
          width: 240,
          height: 90,
          hasAutoArc: true
        },
        'arc-c-rural-1': { type: 'result', text: 'ARC-c', x: 950, y: 795, class: 'arc-c' },
        'rural-ops-2': {
          type: 'result',
          text: 'Operations in Uncontrolled Airspace over Rural Areas',
          x: 950, y: 1230,
          width: 240,
          height: 90,
          hasAutoArc: true
        },
        'arc-b-rural-2': { type: 'result', text: 'ARC-b', x: 950, y: 1095, class: 'arc-b' }
      },
      visitedNodes: new Set(),
      visitedArrows: new Set(),
      history: [],
      currentQuestionNode: null
    };

    // Create SVG
    function createSVG() {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');
      svg.setAttribute('viewBox', '0 0 1100 1650');

      // Arrow marker definition
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'arrowhead');
      marker.setAttribute('markerWidth', '5');
      marker.setAttribute('markerHeight', '3.5');
      marker.setAttribute('refX', '4.5');
      marker.setAttribute('refY', '1.75');
      marker.setAttribute('orient', 'auto');

      const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      polygon.setAttribute('points', '0 0, 5 1.75, 0 3.5');
      polygon.setAttribute('fill', '#333');

      marker.appendChild(polygon);
      defs.appendChild(marker);
      svg.appendChild(defs);

      return svg;
    }

    // Create diamond
    function createDiamond(x: number, y: number, width: number, height: number, id: string) {
      const diamond = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const points = `${x},${y-height/2} ${x+width/2},${y} ${x},${y+height/2} ${x-width/2},${y}`;
      diamond.setAttribute('points', points);
      diamond.setAttribute('class', 'diamond inactive');
      diamond.setAttribute('id', id);
      return diamond;
    }

    // Create box
    function createBox(x: number, y: number, width: number, height: number, id: string, className = '') {
      const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      box.setAttribute('x', (x - width/2).toString());
      box.setAttribute('y', (y - height/2).toString());
      box.setAttribute('width', width.toString());
      box.setAttribute('height', height.toString());
      box.setAttribute('class', `result-box inactive ${className}`);
      box.setAttribute('id', id);
      return box;
    }

    // Create arrow
    function createArrow(x1: number, y1: number, x2: number, y2: number, id: string, label = '') {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', x1.toString());
      line.setAttribute('y1', y1.toString());
      line.setAttribute('x2', x2.toString());
      line.setAttribute('y2', y2.toString());
      line.setAttribute('class', 'arrow inactive');
      line.setAttribute('id', id);
      line.setAttribute('data-label', label);
      return line;
    }

    // Create text
    function createText(x: number, y: number, text: string, id: string, className = '') {
      const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textElement.setAttribute('x', x.toString());
      textElement.setAttribute('y', y.toString());
      textElement.setAttribute('class', `text inactive ${className}`);
      textElement.setAttribute('id', id);
      textElement.textContent = text;
      return textElement;
    }

    // Build flowchart
    function buildFlowchart() {
      const svg = createSVG();
      chartRef.current!.appendChild(svg);

      // Create all nodes
      Object.keys(flowData.nodes).forEach(nodeId => {
        const node = flowData.nodes[nodeId];

        if (node.type === 'question') {
          // Create diamond with increased size
          const diamond = createDiamond(node.x, node.y, 180, 120, `node-${nodeId}`);

          // Add conditional click listener
          diamond.addEventListener('click', function() {
            if (this.classList.contains('active')) {
              openModal(nodeId);
            }
          });

          svg.appendChild(diamond);

          // Create text with line breaks
          const lines = node.text.split(' ');
          if (lines.length > 6) {
            const mid1 = Math.ceil(lines.length / 3);
            const mid2 = Math.ceil(2 * lines.length / 3);
            const text1 = createText(node.x, node.y - 18, lines.slice(0, mid1).join(' '), `text-${nodeId}-1`, 'small');
            const text2 = createText(node.x, node.y, lines.slice(mid1, mid2).join(' '), `text-${nodeId}-2`, 'small');
            const text3 = createText(node.x, node.y + 18, lines.slice(mid2).join(' '), `text-${nodeId}-3`, 'small');
            svg.appendChild(text1);
            svg.appendChild(text2);
            svg.appendChild(text3);
          } else if (lines.length > 3) {
            const text1 = createText(node.x, node.y - 12, lines.slice(0, Math.ceil(lines.length/2)).join(' '), `text-${nodeId}-1`, 'small');
            const text2 = createText(node.x, node.y + 12, lines.slice(Math.ceil(lines.length/2)).join(' '), `text-${nodeId}-2`, 'small');
            svg.appendChild(text1);
            svg.appendChild(text2);
          } else {
            const text = createText(node.x, node.y, node.text, `text-${nodeId}`, 'small');
            svg.appendChild(text);
          }

          // Create arrows with precise connections
          if (node.yes) {
            const yesNode = flowData.nodes[node.yes];
            let arrow: SVGLineElement | null = null;
            let yesText: SVGTextElement | null = null;

            // Horizontal arrows for Yes
            if (nodeId === 'start' || nodeId === 'q2' || nodeId === 'q3' || nodeId === 'q4' || nodeId === 'q5') {
              const targetOffset = yesNode.width ? yesNode.width/2 : 75;
              arrow = createArrow(node.x + 90, node.y, yesNode.x - targetOffset, yesNode.y, `arrow-${nodeId}-yes`);
              yesText = createText((node.x+30 + yesNode.x - targetOffset) / 2, node.y - 22.5, 'Yes', `label-${nodeId}-yes`);
            }
            // Vertical arrows for Yes
            else if (nodeId === 'q6' || nodeId === 'q7' || nodeId === 'q8' || nodeId === 'q6-low' || nodeId === 'q7-low' || nodeId === 'q8-low') {
              arrow = createArrow(node.x, node.y - 60, yesNode.x, yesNode.y + 30, `arrow-${nodeId}-yes`);
              yesText = createText(node.x+30, (node.y + yesNode.y) / 2, 'Yes', `label-${nodeId}-yes`);
            }

            if (arrow) {
              arrow.addEventListener('click', () => handleAnswer(nodeId, 'yes'));
              svg.appendChild(arrow);
              if (yesText) svg.appendChild(yesText);
            }
          }

          if (node.no) {
            const noNode = flowData.nodes[node.no];
            let arrow: SVGLineElement | null = null;
            let noText: SVGTextElement | null = null;

            // Vertical arrows for No
            if (nodeId === 'start' || nodeId === 'q2' || nodeId === 'q3') {
              arrow = createArrow(node.x, node.y + 60, noNode.x, noNode.y - 60, `arrow-${nodeId}-no`);
              noText = createText(node.x+30, (node.y + noNode.y) / 2, 'No', `label-${nodeId}-no`);
            }
            // Vertical arrow for q4 No
            else if (nodeId === 'q4') {
              arrow = createArrow(node.x, node.y + 60, noNode.x, noNode.y - 30, `arrow-${nodeId}-no`);
              noText = createText(node.x+30, (node.y + noNode.y) / 2, 'No', `label-${nodeId}-no`);
            }
            // Vertical arrow for q5 No
            else if (nodeId === 'q5') {
              arrow = createArrow(node.x, node.y + 60, noNode.x, noNode.y - 30, `arrow-${nodeId}-no`);
              noText = createText(node.x+30, (node.y + noNode.y) / 2, 'No', `label-${nodeId}-no`);
            }
            // Horizontal arrows for No
            else if (nodeId === 'q8-low') {
              const targetOffset = noNode.width ? noNode.width/2 : 90;
              arrow = createArrow(node.x + 90, node.y, noNode.x - targetOffset +10, noNode.y, `arrow-${nodeId}-no`);
              noText = createText((node.x+30 + noNode.x - targetOffset) / 2, node.y + 22.5, 'No', `label-${nodeId}-no`);
            }
            else if (nodeId === 'q6' || nodeId === 'q7' || nodeId === 'q8' || nodeId === 'q6-low' || nodeId === 'q7-low') {
              const targetOffset = noNode.width ? noNode.width/2 : 90;
              arrow = createArrow(node.x + 90, node.y, noNode.x - targetOffset, noNode.y, `arrow-${nodeId}-no`);
              noText = createText((node.x+30 + noNode.x - targetOffset) / 2, node.y + 22.5, 'No', `label-${nodeId}-no`);
            }

            if (arrow) {
              arrow.addEventListener('click', () => handleAnswer(nodeId, 'no'));
              svg.appendChild(arrow);
              if (noText) svg.appendChild(noText);
            }
          }

        } else if (node.type === 'result' || node.type === 'intermediate') {
          // Create result box with increased size
          const width = node.width || 150;
          const height = node.height || 60;
          const box = createBox(node.x, node.y, width, height, `node-${nodeId}`, node.class || '');

          // Add click event listener to result boxes
          box.addEventListener('click', function() {
            if (this.classList.contains('active')) {
              handleResultClick(nodeId);
            }
          });

          svg.appendChild(box);

          if (node.text.length > 20) {
            const words = node.text.split(' ');
            const mid = Math.ceil(words.length / 2);
            const text1 = createText(node.x, node.y - 15, words.slice(0, mid).join(' '), `text-${nodeId}-1`, 'small');
            const text2 = createText(node.x, node.y + 15, words.slice(mid).join(' '), `text-${nodeId}-2`, 'small');
            svg.appendChild(text1);
            svg.appendChild(text2);
          } else {
            const text = createText(node.x, node.y, node.text, `text-${nodeId}`);
            svg.appendChild(text);
          }
        }
      });

      // Automatic arrows with verified connections
      const opsArrow = createArrow(155, 1230, 190, 1230, 'arrow-ops-auto');
      svg.appendChild(opsArrow);

      const ruralArcArrow1 = createArrow(950, 885, 950, 825, 'arrow-rural-auto1');
      svg.appendChild(ruralArcArrow1);

      const ruralArcArrow2 = createArrow(950, 1185, 950, 1125, 'arrow-rural-auto2');
      svg.appendChild(ruralArcArrow2);

      // Activate start node
      activateNode('start');
    }

    // Handle result click
    function handleResultClick(nodeId: string) {
      const resultMappings = {
        'arc-a': {
          OpsEnv: "OPS in Atypical or Segregated Airspace",
          IGDR: 1,
          AEC: 12,
          ARCI: "ARC-a"
        },
        'arc-b': {
          OpsEnv: "Operations above Flight Level 600",
          IGDR: 1,
          AEC: 11,
          ARCI: "ARC-b"
        },
        'arc-c-1': {
          OpsEnv: "OPS in Airport/Heliport Environment in Class E airspace or in Class F or G",
          IGDR: 3,
          AEC: 6,
          ARCI: "ARC-c"
        },
        'arc-d-1': {
          OpsEnv: "OPS in Airport/Heliport Environment in Class B, C or D airspace",
          IGDR: 5,
          AEC: 1,
          ARCI: "ARC-d"
        },
        'arc-d-2': {
          OpsEnv: "Operations above 500 feet AGL but below Flight level 600 in a Mode-S Veil or Transponder Mandatory Zone (TMZ)",
          IGDR: 5,
          AEC: 2,
          ARCI: "ARC-d"
        },
        'arc-d-3': {
          OpsEnv: "Operations above 500 feet AGL but below Flight level 600 in controlled airspace",
          IGDR: 5,
          AEC: 3,
          ARCI: "ARC-d"
        },
        'arc-c-4': {
          OpsEnv: "Operations above 500 feet AGL but below Flight level 600 in uncontrolled airspace over Urban Area",
          IGDR: 3,
          AEC: 4,
          ARCI: "ARC-c"
        },
        'arc-c-5': {
          OpsEnv: "Operations below 500 ft AGL OPS in a Mode-S Veil or Transponder Mandatory Zone (TMZ)",
          IGDR: 3,
          AEC: 7,
          ARCI: "ARC-c"
        },
        'arc-c-6': {
          OpsEnv: "Operations below 500 ft AGL OPS in controlled airspace",
          IGDR: 3,
          AEC: 8,
          ARCI: "ARC-c"
        },
        'arc-c-7': {
          OpsEnv: "Operations below 500 ft AGL OPS in uncontrolled airspace over Urban Area",
          IGDR: 2,
          AEC: 9,
          ARCI: "ARC-c"
        },
        'arc-c-rural-1': {
          OpsEnv: "Operations above 500 feet AGL but below Flight level 600 in uncontrolled airspace over Rural Area",
          IGDR: 2,
          AEC: 5,
          ARCI: "ARC-c"
        },
        'arc-b-rural-2': {
          OpsEnv: "Operations below 500 ft AGL in uncontrolled airspace over Rural Area",
          IGDR: 1,
          AEC: 10,
          ARCI: "ARC-b"
        }
      };

      const result = resultMappings[nodeId];
      if (result) {
        onChange({
          ...assessment,
          OpsEnv: result.OpsEnv,
          IGDR: result.IGDR,
          AEC: result.AEC,
          ARCI: result.ARCI
        });
      }
    }

    // Activate node
    function activateNode(nodeId: string) {
      const node = flowData.nodes[nodeId];
      flowData.currentNode = nodeId;
      flowData.visitedNodes.add(nodeId);

      // Activate current node
      const nodeElement = document.getElementById(`node-${nodeId}`);
      const textElements = [
        document.getElementById(`text-${nodeId}`),
        document.getElementById(`text-${nodeId}-1`),
        document.getElementById(`text-${nodeId}-2`),
        document.getElementById(`text-${nodeId}-3`)
      ].filter(el => el);

      if (nodeElement) {
        nodeElement.classList.remove('inactive');
        nodeElement.classList.add('active');
        if (node.type === 'result') {
          nodeElement.classList.add('final');
        }
      }

      textElements.forEach(textEl => {
        if (textEl) textEl.classList.remove('inactive');
      });

      // Special handling for ops-500 (automatic transition)
      if (nodeId === 'ops-500') {
        const autoArrow = document.getElementById('arrow-ops-auto');
        if (autoArrow) {
          autoArrow.classList.remove('inactive');
          autoArrow.classList.add('active');
        }
        setTimeout(() => {
          activateNode('q6-low');
        }, 1000);
        return;
      }

      // Handling for rural-ops-1 with automatic transition to ARC-c
      if (nodeId === 'rural-ops-1') {
        const ruralArrow = document.getElementById('arrow-rural-auto1');
        if (ruralArrow) {
          ruralArrow.classList.remove('inactive');
          ruralArrow.classList.add('active');
        }
        setTimeout(() => {
          activateNode('arc-c-rural-1');
        }, 1000);
        return;
      }

      // Handling for rural-ops-2 with automatic transition to ARC-b
      if (nodeId === 'rural-ops-2') {
        const ruralArrow = document.getElementById('arrow-rural-auto2');
        if (ruralArrow) {
          ruralArrow.classList.remove('inactive');
          ruralArrow.classList.add('active');
        }
        setTimeout(() => {
          activateNode('arc-b-rural-2');
        }, 1000);
        return;
      }

      // Activate clickable arrows if it's a question
      if (node.type === 'question') {
        if (node.yes) {
          const yesArrow = document.getElementById(`arrow-${nodeId}-yes`);
          const yesLabel = document.getElementById(`label-${nodeId}-yes`);
          if (yesArrow && yesLabel) {
            yesArrow.classList.remove('inactive');
            yesArrow.classList.add('clickable');
            yesLabel.classList.remove('inactive');
          }
        }
        if (node.no) {
          const noArrow = document.getElementById(`arrow-${nodeId}-no`);
          const noLabel = document.getElementById(`label-${nodeId}-no`);
          if (noArrow && noLabel) {
            noArrow.classList.remove('inactive');
            noArrow.classList.add('clickable');
            noLabel.classList.remove('inactive');
          }
        }
      }
    }

    // Handle answers
    function handleAnswer(nodeId: string, answer: string) {
      const node = flowData.nodes[nodeId];
      const nextNodeId = answer === 'yes' ? node.yes : node.no;

      if (nextNodeId) {
        // Save current state in history
        const currentState = {
          currentNode: flowData.currentNode,
          visitedNodes: new Set(flowData.visitedNodes),
          visitedArrows: new Set(flowData.visitedArrows)
        };
        flowData.history.push(currentState);

        // Mark arrow as active
        const arrow = document.getElementById(`arrow-${nodeId}-${answer}`);
        if (arrow) {
          arrow.classList.add('active');
          arrow.classList.remove('clickable');
          flowData.visitedArrows.add(`arrow-${nodeId}-${answer}`);
        }

        // Deactivate the other arrow if it exists
        const oppositeAnswer = answer === 'yes' ? 'no' : 'yes';
        const oppositeArrow = document.getElementById(`arrow-${nodeId}-${oppositeAnswer}`);
        if (oppositeArrow) {
          oppositeArrow.classList.remove('clickable');
          oppositeArrow.classList.add('inactive');
        }

        // Move to next node
        setTimeout(() => {
          activateNode(nextNodeId);
        }, 300);
      }
    }

    // Go back function
    function goBack() {
      if (flowData.history.length > 0) {
        const previousState = flowData.history.pop()!;

        // Reset current state with previous state
        flowData.currentNode = previousState.currentNode;
        flowData.visitedNodes = new Set(previousState.visitedNodes);
        flowData.visitedArrows = new Set(previousState.visitedArrows);

        // Reset display
        document.querySelectorAll('.diamond, .result-box, .arrow, .text').forEach(el => {
          el.classList.remove('active', 'clickable', 'final');
          el.classList.add('inactive');
        });

        // Reactivate visited nodes and arrows
        flowData.visitedNodes.forEach(nodeId => {
          const nodeElement = document.getElementById(`node-${nodeId}`);
          const textElements = [
            document.getElementById(`text-${nodeId}`),
            document.getElementById(`text-${nodeId}-1`),
            document.getElementById(`text-${nodeId}-2`)
          ].filter(el => el);

          if (nodeElement) {
            nodeElement.classList.remove('inactive');
            nodeElement.classList.add('active');
          }
          textElements.forEach(textEl => {
            if (textEl) textEl.classList.remove('inactive');
          });
        });

        flowData.visitedArrows.forEach(arrowId => {
          const arrowElement = document.getElementById(arrowId);
          if (arrowElement) {
            arrowElement.classList.remove('inactive');
            arrowElement.classList.add('active');
          }
        });

        // Reactivate current node
        activateNode(flowData.currentNode);
      }
    }

    // Open modal
    function openModal(nodeId: string) {
      const node = flowData.nodes[nodeId];
      if (node.type === 'question') {
        flowData.currentQuestionNode = nodeId;
        const modal = document.getElementById('questionModal');
        const modalQuestion = document.getElementById('modalQuestion');
        if (modal && modalQuestion) {
          modalQuestion.textContent = node.text;
          modal.classList.remove('hidden');
        }
      }
    }

    // Close modal
    function closeModal() {
      const modal = document.getElementById('questionModal');
      if (modal) {
        modal.classList.add('hidden');
      }
    }

    // Handle modal answer
    function handleModalAnswer(answer: string) {
      if (flowData.currentQuestionNode) {
        handleAnswer(flowData.currentQuestionNode, answer);
        closeModal();
      }
    }

    // Reset questionnaire
    function resetQuestionnaire() {
      flowData.currentNode = 'start';
      flowData.visitedNodes.clear();
      flowData.visitedArrows.clear();
      flowData.history = [];

      document.querySelectorAll('.diamond, .result-box, .arrow, .text').forEach(el => {
        el.classList.remove('active', 'clickable', 'final');
        el.classList.add('inactive');
      });

      activateNode('start');
    }

    // Make functions globally available
    window.goBack = goBack;
    window.resetQuestionnaire = resetQuestionnaire;
    window.handleModalAnswer = handleModalAnswer;
    window.closeModal = closeModal;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .diamond {
        fill: #f9f9f9;
        stroke: #333;
        stroke-width: 2;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .diamond.active {
        fill: #4CAF50;
        stroke: #2E7D32;
        stroke-width: 3;
        filter: drop-shadow(0 4px 6px rgba(76, 175, 80, 0.3));
      }
      .diamond.inactive {
        opacity: 0.3;
        fill: #e0e0e0;
        stroke: #bdbdbd;
        cursor: default;
      }
      .result-box {
        fill: #fff;
        stroke: #333;
        stroke-width: 2;
        rx: 30;
      }
      .result-box.arc-a {
        fill: #4CAF50;
        stroke: #2E7D32;
      }
      .result-box.arc-b {
        fill: #FFEB3B;
        stroke: #F57F17;
      }
      .result-box.arc-c {
        fill: #FF9800;
        stroke: #E65100;
      }
      .result-box.arc-d {
        fill: #F44336;
        stroke: #C62828;
      }
      .result-box.final {
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
        stroke-width: 4;
      }
      .result-box.inactive {
        opacity: 0.3;
        fill: #e0e0e0;
        stroke: #bdbdbd;
      }
      .arrow {
        stroke: #333;
        stroke-width: 3;
        fill: none;
        marker-end: url(#arrowhead);
        transition: all 0.3s ease;
      }
      .arrow.inactive {
        opacity: 0.3;
        stroke: #bdbdbd;
      }
      .arrow.active {
        stroke: #4CAF50;
        stroke-width: 4.5;
      }
      .arrow.clickable {
        cursor: pointer;
        stroke-width: 4.5;
      }
      .arrow.clickable:hover {
        stroke: #FF5722;
      }
      .text {
        font-size: 16.5px;
        text-anchor: middle;
        dominant-baseline: middle;
        pointer-events: none;
      }
      .text.inactive {
        opacity: 0.3;
        fill: #bdbdbd;
      }
      .text.small {
        font-size: 15px;
      }
    `;
    document.head.appendChild(style);

    // Initialize
    buildFlowchart();
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Rappel des données :</h2>
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Limite verticale du Volume d'évolution (Flight Geometry) :
        </label>
        <div className="mt-1 p-2 bg-gray-100 rounded-md">
          {assessment.FlightGeographyHeight} m
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Limite verticale du Volume de contingence (Contingency Volume) :
        </label>
        <div className="mt-1 p-2 bg-gray-100 rounded-md">
          {assessment.ContingencyVolumeHeight} m
        </div>
        <label className="block text-sm font-medium text-gray-700">
          Limite verticale du Volume Adjacent (Adjacent Volume) :
        </label>
        <div className="mt-1 p-2 bg-gray-100 rounded-md">
          {assessment.AdjacentVolumeHeight} m
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-semibold">Volume d'espace aérien</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez une ou plusieurs des neuf options. Sélectionnez 'Autre' si aucune des options précédentes ne s'applique (par exemple, les zones militaires).">
              <label className="block text-sm font-medium text-gray-700">
                Classe d'espace aérien de l'opération envisagée
              </label>
            </Tooltip>
            <div className="mt-1 space-y-2">
              {checkboxes.map((cls) => (
                <div key={cls} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={(assessment.airspaceClasses || []).includes(cls)}
                    onChange={
                      (e) =>
                        onChange({
                          ...assessment,
                          airspaceClasses: e.target.checked
                            ? [...(assessment.airspaceClasses || []), cls]
                            : (assessment.airspaceClasses || []).filter((c) => c !== cls),
                        })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">{cls}</label>
                  {cls === 'U-Space' && (assessment.airspaceClasses || []).includes('U-Space') && (
                    <input
                      type="text"
                      value={assessment.uspaceProvider}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          uspaceProvider: e.target.value,
                        })}
                      className="ml-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Fournisseur de service USSP"
                    />
                  )}
                  {cls === 'Autre, Préciser' && (assessment.airspaceClasses || []).includes('Autre, Préciser') && (
                    <input
                      type="text"
                      value={assessment.otherDetails}
                      onChange={(e) =>
                        onChange({
                          ...assessment,
                          otherDetails: e.target.value,
                        })}
                      className="ml-4 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Préciser la nature de l'espace aérien"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <Tooltip text="Si l'autorité compétente, l'ANSP ou le service UTM/U-space fournit une carte des risques de collision aérienne (statique ou dynamique), le candidat doit utiliser ce service pour déterminer l'ARC initiale/résiduelle.">
            <label className="block text-sm font-medium text-gray-700">
              Carte des risques de collision aérienne (statique ou dynamique)
            </label>
          </Tooltip>
          <input
            type="checkbox"
            checked={(assessment.AirCollisionRiskMap || []).includes('OUI')}
            onChange={(e) =>
              onChange({
                ...assessment,
                AirCollisionRiskMap: e.target.checked
                  ? 'OUI'
                  : 'NON',
              })}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />&nbsp;&nbsp;Le service est disponible et sera utilisé
          { assessment.AirCollisionRiskMap=='OUI' ? (
            <div>
              <Tooltip text={
                <div>
                  U-SPACE
                  <br />
                  Si vous avez sélectionné "U-Space" comme classe d'espace aérien, veuillez indiquer le nom du fournisseur de service UTM (USSP) que vous utiliserez pour l'opération.
                </div>
              }>
                <label className="block text-sm font-medium text-gray-700">
                  Merci de préciser les informations sur votre fournisseur de service
                </label>
              </Tooltip>
              <textarea
                value={assessment.AirCollisionRiskMapJustification}
                onChange={(e) =>
                  onChange({
                    ...assessment,
                    AirCollisionRiskMapJustification: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows="4"
              ></textarea>
            </div>
          ) :(
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Si vous n'avez pas de fournisseur de service, identifier l'ARC initial du volume opérationnel à l'aide de l'arbre de décision ci-dessous.
              </label>
            </div>)
          }
        </div>
      </div>


    { assessment.AirCollisionRiskMap=='NON' ? (
      <div>
      {/* Enhanced ARC Interactive Questionnaire */}
      <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Questionnaire ARC - Classification des Espaces Aériens<button
                      type="button"
                      onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-v2.5-Main-Body-Release-JAR_doc_25.pdf#page=33', '_blank')}  
                      className="text-blue-500 hover:text-blue-700 transition-colors"
                      title="Ouvrir la documentation JARUS SORA v2.5 Main Body - 4.4 Step #4 – Determination of the initial Air Risk Class (ARC)    "
                    >
                <HelpCircle className="w-4 h-4" />
              </button></h2>

        {/* { assessment.AirCollisionRiskMap=='OUI' ? (
          <label className="block text-sm font-medium text-gray-700">
            Si votre service de carte des risques de collision aérienne est disponible, veuillez l'utiliser pour déterminer l'ARC initial. Vous pouvez alors passer à l'étape suivante en bas de page en spécifiant vos Niveaux de Risque Air Initiaux.
          </label>
        ) : (
        <label className="block text-sm font-medium text-gray-700">
            Cliquez sur les nœuds pour répondre aux questions et déterminer l'ARC initial.
        </label>
        )}  */}
        <div className="bg-white rounded-lg p-5 shadow-lg border border-gray-200">
          <div
            ref={chartRef}
            className="w-full h-[1100px] border border-gray-300 rounded-md overflow-hidden"
            id="flowchart"
          />

          <div className="flex gap-2 mt-5">
            <button
              onClick={() => {
                if (window.goBack) window.goBack();
              }}
              className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Revenir en arrière
            </button>
            <button
              onClick={() => {
                if (window.resetQuestionnaire) window.resetQuestionnaire();
              }}
              className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Recommencer
            </button>
          </div>
        </div>

        {/* Modal */}
        <div id="questionModal" className="fixed inset-0 bg-black bg-opacity-50 z-50 hidden">
          <div className="bg-white mx-auto mt-[15%] p-5 border border-gray-300 w-4/5 max-w-lg rounded-lg text-center">
            <p id="modalQuestion" className="mb-5"></p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => {
                  if (window.handleModalAnswer) window.handleModalAnswer('yes');
                }}
                className="px-5 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  if (window.handleModalAnswer) window.handleModalAnswer('no');
                }}
                className="px-5 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                No
              </button>
              <button
                onClick={() => {
                  if (window.closeModal) window.closeModal();
                }}
                className="px-5 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-gray-400 p-4 md:col-span-2 rounded-md">
            <label className="block text-sm font-medium text-blue-700 mt-4">
              <i>Cliquer sur le nœud ARC précédemment identifier pour valider et afficher les détails de l'ARC initial.</i>
            <button
                type="button"
                onClick={() => window.open('http://jarus-rpas.org/wp-content/uploads/2024/06/SORA-Annex-C-v1.0.pdf', '_blank')}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title="Ouvrir la documentation JARUS : SORA-Annex-C-v1.0"
              >
                <HelpCircle className="w-4 h-4" />
              </button></label>
            <label className="block text-sm font-bold text-gray-700 mt-4">
              Volume Opérationnel, AEC and ARC.
            </label>
            <div>
              <div className="mt-1 p-2 bg-gray-50 rounded-md">
                {/* {assessment.DroseraResTable && assessment.DroseraResTable.length > 0 ? ( */}
                <label className="block text-sm font-medium text-gray-700">
                  {assessment.OpsEnv}
                </label>  
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-100 text-black">
                        <th className="py-2 px-4 border-b">Taux initial de densité généralisée</th>
                        <th className="py-2 px-4 border-b">Catégories de rencontres dans l'espace aérien</th>
                        <th className="py-2 px-4 border-b">ARC Initial</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gray-50 text-gray-700">
                        <td className="py-2 px-4 border-b">{assessment.IGDR}</td>
                        <td className="py-2 px-4 border-b">{assessment.AEC}</td>
                        <td className="py-2 px-4 border-b">{assessment.ARCI}</td>
                      </tr>
                    </tbody>
                  </table>
                {/* ) : (
                  <div className="text-gray-600">
                    Aucune donnée disponible. Veuillez télécharger un fichier DROSERA valide.
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    ) : null }





        <h2 className="text-2xl font-semibold">Niveau de Risque Air Initial</h2>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          <div>
            <Tooltip text="Sélectionnez le Niveau de Risque Air Initial pour l'opération envisagée.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Opérationnel
              </label>
            </Tooltip>
            <select
              value={assessment.OperationalVolumeLevel}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  OperationalVolumeLevel: e.target.value as OperationalVolumeLevel,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Indiquer une valeur">
                        Indiquer une valeur
                        </option>
              <option value="ARC-a">ARC-a</option>
              <option value="ARC-b">ARC-b</option>
              <option value="ARC-c">ARC-c</option>
              <option value="ARC-d">ARC-d</option>
            </select>
          </div>
          <div>
            <Tooltip text="Sélectionnez le Niveau de Risque Air Initial pour le volume adjacent.">
              <label className="block text-sm font-medium text-gray-700">
                Volume Adjacent
              </label>
            </Tooltip>
            <select
              value={assessment.AdjacentVolumeLevel}
              onChange={(e) =>
                onChange({
                  ...assessment,
                  AdjacentVolumeLevel: e.target.value as AdjacentVolumeLevel,
                })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="Indiquer une valeur">
                        Indiquer une valeur
                        </option>
              <option value="ARC-a">ARC-a</option>
              <option value="ARC-b">ARC-b</option>
              <option value="ARC-c">ARC-c</option>
              <option value="ARC-d">ARC-d</option>
            </select>
          </div>
        </div>




    </div>
  );
}
