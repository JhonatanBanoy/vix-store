import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = uri ? new MongoClient(uri) : null;

export async function GET() {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MONGODB_URI no configurada' }, { status: 500 });
    }
    await client.connect();
    const database = client.db('ecommerce');
    const products = await database.collection('products').find({}).toArray();
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MONGODB_URI no configurada' }, { status: 500 });
    }
    const product = await request.json();
    await client.connect();
    const database = client.db('ecommerce');
    const result = await database.collection('products').insertOne(product);
    return NextResponse.json({ _id: result.insertedId, ...product });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PUT(request) {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MONGODB_URI no configurada' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const product = await request.json();
    
    await client.connect();
    const database = client.db('ecommerce');
    await database.collection('products').updateOne(
      { _id: new ObjectId(id) },
      { $set: product }
    );
    return NextResponse.json({ message: 'Producto actualizado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function DELETE(request) {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MONGODB_URI no configurada' }, { status: 500 });
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await client.connect();
    const database = client.db('ecommerce');
    await database.collection('products').deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ message: 'Producto eliminado' });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  } finally {
    await client.close();
  }
} 