
const WebSocket = require('ws');

class AgentWebSocketServer {
    constructor(server) {
        this.wss = new WebSocket.Server({ server });
        this.agents = new Map(); // agentId -> websocket
        this.rooms = new Map();  // roomId -> Set of agentIds
        
        this.wss.on('connection', (ws, req) => {
            this.handleConnection(ws, req);
        });
    }
    
    handleConnection(ws, req) {
        let agentId = null;
        
        ws.on('message', (data) => {
            try {
                const message = JSON.parse(data);
                this.handleMessage(ws, message, agentId);
            } catch (e) {
                ws.send(JSON.stringify({ error: 'Invalid JSON' }));
            }
        });
        
        ws.on('close', () => {
            if (agentId) {
                this.agents.delete(agentId);
                this.broadcastAgentStatus(agentId, 'offline');
            }
        });
    }
    
    handleMessage(ws, message, agentId) {
        switch (message.type) {
            case 'register':
                agentId = message.agentId;
                this.agents.set(agentId, ws);
                this.broadcastAgentStatus(agentId, 'online');
                ws.send(JSON.stringify({ type: 'registered', agentId }));
                break;
                
            case 'agent_message':
                this.forwardMessage(message.targetAgent, message.content, agentId);
                break;
                
            case 'join_room':
                this.joinRoom(agentId, message.roomId);
                break;
                
            case 'governance_vote':
                this.broadcastToRoom('governance', message);
                break;
        }
    }
    
    broadcastAgentStatus(agentId, status) {
        const statusMessage = {
            type: 'agent_status',
            agentId,
            status,
            timestamp: Date.now()
        };
        
        this.broadcast(statusMessage);
    }
    
    broadcast(message) {
        const json = JSON.stringify(message);
        this.agents.forEach(ws => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(json);
            }
        });
    }
    
    forwardMessage(targetAgentId, content, fromAgentId) {
        const targetWs = this.agents.get(targetAgentId);
        if (targetWs && targetWs.readyState === WebSocket.OPEN) {
            targetWs.send(JSON.stringify({
                type: 'agent_message',
                from: fromAgentId,
                content,
                timestamp: Date.now()
            }));
        }
    }
    
    joinRoom(agentId, roomId) {
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId).add(agentId);
    }
    
    broadcastToRoom(roomId, message) {
        const room = this.rooms.get(roomId);
        if (room) {
            room.forEach(agentId => {
                const ws = this.agents.get(agentId);
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(message));
                }
            });
        }
    }
}

module.exports = AgentWebSocketServer;