const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const crypto = require('crypto');

class SimpleDB {
    constructor(dbPath) {
        this.dbPath = dbPath || './data.json';
        this.data = this.loadDataSync();
        this.saveLock = false;
    }

    loadDataSync() {
        try {
            const rawData = fsSync.readFileSync(this.dbPath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            return {};
        }
    }

    async save() {
        if (this.saveLock) {
            throw new Error('Save operation in progress');
        }

        this.saveLock = true;
        try {
            const tempPath = this.dbPath + '.tmp';
            const dataString = JSON.stringify(this.data, null, 2);
            
            // Write to temporary file first (atomic operation)
            await fs.writeFile(tempPath, dataString, 'utf8');
            
            // Rename to final file (atomic on most filesystems)
            await fs.rename(tempPath, this.dbPath);
            
            return true;
        } catch (error) {
            console.error('Failed to save database:', error.message);
            return false;
        } finally {
            this.saveLock = false;
        }
    }

    async insert(table, record) {
        if (!this.data[table]) {
            this.data[table] = [];
        }
        
        record.id = crypto.randomUUID();
        record.createdAt = new Date().toISOString();
        this.data[table].push(record);
        await this.save();
        
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

    async update(table, id, updates) {
        if (!this.data[table]) {
            return false;
        }
        
        for (let i = 0; i < this.data[table].length; i++) {
            if (this.data[table][i].id === id) {
                Object.assign(this.data[table][i], updates);
                this.data[table][i].updatedAt = new Date().toISOString();
                await this.save();
                return true;
            }
        }
        
        return false;
    }

    async delete(table, id) {
        if (!this.data[table]) {
            return false;
        }
        
        const initialLength = this.data[table].length;
        this.data[table] = this.data[table].filter(record => record.id !== id);
        
        if (this.data[table].length < initialLength) {
            await this.save();
            return true;
        }
        
        return false;
    }
}

module.exports = SimpleDB;
