const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function run() { 
    try { 
        const payload = { 
            booking_id: '123', 
            user_id: '123', 
            salon_id: '123', 
            treatment_details: 'test', 
            products_used: 'test', 
            skin_reaction: 'test', 
            improvement_notes: 'test', 
            recommended_next_treatment: 'test', 
            post_treatment_instructions: 'test' 
        }; 
        await prisma.treatmentRecord.create({ data: payload }); 
        console.log('Success!'); 
    } catch(e) { 
        console.error(e); 
    } finally { 
        await prisma.$disconnect(); 
    } 
} 
run();
