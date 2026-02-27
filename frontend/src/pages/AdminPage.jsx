import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, X, Save } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../api/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner'];
const empty = { name: '', category: ['Breakfast'], image: '', ingredients: [{ name: '', quantity: '' }], instructions: [''] };

export default function AdminPage() {
    const [dishes, setDishes] = useState([]);
    const [modal, setModal] = useState(false);
    const [form, setForm] = useState(empty);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const fetchDishes = () => api.get('/dishes').then(({ data }) => setDishes(data));
    useEffect(() => { fetchDishes(); }, []);

    const openAdd = () => { setForm(empty); setEditing(null); setModal(true); };
    const openEdit = (dish) => { setForm({ ...dish }); setEditing(dish._id); setModal(true); };

    const handleSave = async () => {
        setSaving(true);
        try {
            if (editing) await api.put(`/dishes/${editing}`, form);
            else await api.post('/dishes', form);
            toast.success(editing ? 'Dish updated!' : 'Dish added!');
            setModal(false);
            fetchDishes();
        } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
        finally { setSaving(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this dish?')) return;
        await api.delete(`/dishes/${id}`);
        toast.success('Dish deleted');
        fetchDishes();
    };

    const addIng = () => setForm({ ...form, ingredients: [...form.ingredients, { name: '', quantity: '' }] });
    const addStep = () => setForm({ ...form, instructions: [...form.instructions, ''] });

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="pt-20 max-w-6xl mx-auto px-4 pb-24">
                <div className="flex items-center justify-between my-6">
                    <h2 className="text-2xl font-bold">🛠️ Admin Panel</h2>
                    <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Dish</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dishes.map((dish) => (
                        <div key={dish._id} className="card p-4 flex gap-3">
                            <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate dark:text-gray-100">{dish.name}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500">{(dish.category || []).join(', ')}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => openEdit(dish)} className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-950/30 text-orange-500 transition-colors"><Edit3 size={14} /></button>
                                <button onClick={() => handleDelete(dish._id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 transition-colors"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {modal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="card w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg">{editing ? 'Edit Dish' : 'Add New Dish'}</h3>
                                <button onClick={() => setModal(false)}><X size={20} /></button>
                            </div>
                            <div className="space-y-3">
                                <input className="input" placeholder="Dish name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 ml-1">Categories (Select at least one)</p>
                                    <div className="flex flex-wrap gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-xl">
                                        {CATEGORIES.map((c) => (
                                            <button key={c} type="button" onClick={() => {
                                                const current = form.category || [];
                                                const updated = current.includes(c)
                                                    ? current.filter(x => x !== c)
                                                    : [...current, c];
                                                setForm({ ...form, category: updated });
                                            }} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${form.category?.includes(c) ? 'bg-orange-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

                                <p className="font-semibold text-sm mt-2">Ingredients</p>
                                {form.ingredients.map((ing, i) => (
                                    <div key={i} className="flex gap-2 min-w-0">
                                        <input className="input flex-[2] min-w-0 text-sm" placeholder="Ingredient Name" value={ing.name} onChange={(e) => { const a = [...form.ingredients]; a[i].name = e.target.value; setForm({ ...form, ingredients: a }); }} />
                                        <input className="input flex-1 min-w-[80px] text-sm" placeholder="Qty" value={ing.quantity} onChange={(e) => { const a = [...form.ingredients]; a[i].quantity = e.target.value; setForm({ ...form, ingredients: a }); }} />
                                    </div>
                                ))}
                                <button onClick={addIng} className="text-orange-500 text-sm font-medium flex items-center gap-1"><Plus size={14} /> Add Ingredient</button>

                                <p className="font-semibold text-sm mt-2">Instructions</p>
                                {form.instructions.map((step, i) => (
                                    <textarea key={i} className="input text-sm resize-none" rows={2} placeholder={`Step ${i + 1}`} value={step}
                                        onChange={(e) => { const a = [...form.instructions]; a[i] = e.target.value; setForm({ ...form, instructions: a }); }} />
                                ))}
                                <button onClick={addStep} className="text-orange-500 text-sm font-medium flex items-center gap-1"><Plus size={14} /> Add Step</button>

                                <button onClick={handleSave} disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
                                    <Save size={16} /> {saving ? 'Saving...' : 'Save Dish'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
