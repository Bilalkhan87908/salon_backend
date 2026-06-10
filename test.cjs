const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 
async function run() { 
    try { 
        const user = await prisma.user.create({ data: { email: 'test5@test.com', password_hash: '123' }}); 
        const salon = await prisma.salon.create({ data: { name: 'Test Salon 5', slug: 'test-salon-5' } }); 
        const service = await prisma.service.create({ data: { name: 'test service 5', salon: { connect: { id: salon.id } }, price: 10, duration_minutes: 30 } });
        const booking = await prisma.booking.create({ data: { user: { connect: { id: user.id } }, salon: { connect: { id: salon.id } }, service: { connect: { id: service.id } }, booking_date: new Date(), booking_time: new Date(), total_amount: 10, status: 'completed' }}); 
        console.log('booking:', booking.id); 
        const payload = { 
            booking_id: booking.id, 
            user_id: booking.user_id, 
            salon_id: booking.salon_id, 
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
