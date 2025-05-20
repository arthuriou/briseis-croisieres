import { createClient } from '@supabase/supabase-js'

// Récupérer les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
 
// Vérifier si les variables d'environnement sont définies
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey

// Créer un client Supabase avec gestion d'erreur améliorée
const createSupabaseClient = () => {
  if (!isSupabaseConfigured) {
    console.warn(
      'Supabase URL ou clé anonyme manquante. Vérifiez vos variables d\'environnement (.env.local).'
    )
    
    // En développement, retourner un client factice pour éviter les erreurs
    if (process.env.NODE_ENV === 'development') {
      return createMockClient()
    }
  }

  // Créer un vrai client Supabase
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de Supabase:', error)
    return createMockClient()
  }
}

// Client factice pour le développement
const createMockClient = () => {
  // Méthodes communes pour simulation des requêtes
  const mockQueryBuilder = {
    select: () => mockQueryBuilder,
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => mockQueryBuilder,
    delete: () => mockQueryBuilder,
    eq: () => mockQueryBuilder,
    neq: () => mockQueryBuilder,
    gt: () => mockQueryBuilder,
    lt: () => mockQueryBuilder,
    gte: () => mockQueryBuilder,
    lte: () => mockQueryBuilder,
    like: () => mockQueryBuilder,
    ilike: () => mockQueryBuilder,
    is: () => mockQueryBuilder,
    in: () => mockQueryBuilder,
    contains: () => mockQueryBuilder,
    containedBy: () => mockQueryBuilder,
    range: () => mockQueryBuilder,
    overlaps: () => mockQueryBuilder,
    textSearch: () => mockQueryBuilder,
    match: () => mockQueryBuilder,
    single: () => Promise.resolve({ data: null, error: null }),
    maybeSingle: () => Promise.resolve({ data: null, error: null }),
    then: (callback: Function) => Promise.resolve(callback({ data: null, error: null })),
  };

  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    },
    from: () => mockQueryBuilder,
    // Autres méthodes que vous pourriez utiliser
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        download: () => Promise.resolve({ data: null, error: null }),
      }),
    },
    rpc: () => Promise.resolve({ data: null, error: null }),
  }
}

export const supabase = createSupabaseClient() 