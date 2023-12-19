require('dotenv').config();
const { GEMINI_SECRET } = require("../configs")
const { Translation } = require("../models/quran.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

class QuranCtrl {
    constructor() {
        this.genAI = new GoogleGenerativeAI(GEMINI_SECRET);
        this.MODEL_NAME = "embedding-001";
    }

    async queryDb(text) {
        try {
            const vecEmbdd = await this.stringToVector(text);
            const translations = await this.vectorSearch(vecEmbdd);
            return { ok: true, data: translations };
        } catch (error) {
            console.error('Error in queryDb:', error.message);
            return { ok: false, message: error.message };
        }
    }
    async getAll() {
        try {
            let data = await Translation.find()
            return { ok: true, data };
        } catch (error) {
            console.error('Error in queryDb:', error.message);
            return { ok: false, message: error.message };
        }
    }

    // async vectorSearch(embedding) {
    //     try {
    //         const translations = await Translation
    //             .aggregate([
    //                 {
    //                     $search: {
    //                         knnBeta: {
    //                             vector: embedding,
    //                             // path is the path to the embedding field in the mongodb collection documentupload
    //                             path: 'contentEmbedding',
    //                             // change k to the number of documents you want to be returned
    //                             k: 5,
    //                         },
    //                     },
    //                 },
    //                 {
    //                     $project: {
    //                         translatorName: 1,
    //                         language: 1,
    //                         content: 1,
    //                         verseNumber: 1,
    //                         chapterNumber: 1,
    //                         score: { $meta: 'searchScore' },
    //                     },
    //                 },
    //             ])
    //         return translations;
    //     } catch (error) {
    //         console.error('Error in vectorSearch:', error.message);
    //         return error.message;
    //     }
    // }

    async vectorSearch(queryVector) {
        try {
            const translations = await Translation.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index",
                        path: "contentEmbedding",
                        queryVector: queryVector,
                        numCandidates: 100,
                        limit: 3
                    },
                }, {
                    $project: {
                        translatorName: 1,
                        language: 1,
                        content: 1,
                        verseNumber: 1,
                        chapterNumber: 1,
                        score: { $meta: 'searchScore' },
                    },
                }

            ]);
            return translations;
        } catch (error) {
            console.error('Error in vectorSearch:', error.message);
            return error.message;
        }
    }

    async stringToVector(text) {
        try {
            const model = this.genAI.getGenerativeModel({ model: this.MODEL_NAME });
            const result = await model.embedContent(text);
            const { values } = result.embedding;
            return values;
        } catch (error) {
            console.error('Error in stringToVector:', error.message);
            return error.message;
        }
    }
}

const quranCtrl = new QuranCtrl();
module.exports = quranCtrl;
