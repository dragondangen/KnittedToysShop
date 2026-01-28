using Domain.Entities;

namespace Application.Interfaces;

public interface IToyRepository
{
    Task<IEnumerable<Toy>> GetAllAsync();
    Task<Toy?> GetByIdAsync(int id);
    Task AddAsync(Toy toy);
    Task DeleteAsync(int id);
    Task UpdateAsync(Toy toy);
}