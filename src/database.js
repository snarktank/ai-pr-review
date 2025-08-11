const fs = require('fs');
const path = require('path');

class SimpleDB {
    constructor(dbPath) {
        this.dbPath = dbPath || './data.json';
        this.data = this.loadData();
    }

    loadData() {
        try {
            const rawData = fs.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            return {};
        }
    }

    save() {
        try {
            fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
            return true;
        } catch (error) {
            console.error('Failed to save database:', error.message);
            return false;
        }
    }

    insert(table, record) {
        if (!this.data[table]) {
            this.data[table] = [];
        }
        
        record.id = Date.now();
        this.data[table].push(record);
        this.save();
        
        return record.id;
    }

    find(table, query) {
        if (!this.data[table]) {
            return [];
        }
        
        return this.data[table].filter(record => {
            for (let key in query) {
                if (record[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    update(table, id, updates) {
        if (!this.data[table]) {
            return false;
        }
        
        for (let i = 0; i < this.data[table].length; i++) {
            if (this.data[table][i].id === id) {
                Object.assign(this.data[table][i], updates);
                this.save();
                return true;
            }
        }
        
        return false;
    }

    delete(table, id) {
        if (!this.data[table]) {
            return false;
        }
        
        const initialLength = this.data[table].length;
        this.data[table] = this.data[table].filter(record => record.id !== id);
        
        if (this.data[table].length < initialLength) {
            this.save();
            return true;
        }
        
        return false;
    }
}

module.exports = SimpleDB;
